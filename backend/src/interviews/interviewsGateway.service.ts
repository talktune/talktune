import { PostgresChatMessageHistory } from "@langchain/community/stores/message/postgres";
import { StringOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { ConversationChain } from "langchain/chains";
import { BufferWindowMemory } from "langchain/memory";
import { OutputFixingParser } from "langchain/output_parsers";
import pg from "pg";
import { Activity } from "src/activity/entities/activity.entity";
import { DynamicPrompt } from "src/dynamic-prompt/entities/dynamic-prompt.entity";
import { getOpenAIChatInstance } from "src/util/OpenAIUtil";
import { Repository } from "typeorm";
import { z } from "zod";
import { Interview, InterviewStage, Preferences } from "./entities/interviews.entity";
import { AnswerFromUserInputTypes, InitializeInterviewInputTypes, InterimAnswerInputTypes } from "./interfaces/interviewTypes";
import { InterviewEndPrompt, InterviewInitializationPrompt, InterviewNotAnsweredPrompt, InterviewOngoingPrompt } from "./interviews.template";
import { defaultEndInterviewOutputStructure, defaultInitializeInterviewOutputStructure, defaultNotAnsweredInterviewOutputStructure, defaultOnGoingInterimInterviewOutputStructure } from "./output-parsers/interviews.parser";

@Injectable()
export class InterviewsGatewayService {
    /**
     * This function initializes the interview
     * @param
     * @returns 
     */
    private readonly logger: Logger;

    // MARK: Constructor
    constructor(
        @InjectRepository(Interview)
        private readonly interviewsRepository: Repository<Interview>,
        @InjectRepository(InterviewStage)
        private readonly interviewStageRepository: Repository<InterviewStage>,
        @InjectRepository(Preferences)
        private readonly preferencesRepository: Repository<Preferences>,
        @InjectRepository(Activity)
        private readonly activityRepository: Repository<Activity>,
        @InjectRepository(DynamicPrompt)
        private readonly dynamicPromptRepository: Repository<DynamicPrompt>,
    ) {
        this.logger = new Logger("InterviewsService");
    }


    // MARK: Initialize Interview
    async initializeInterview({
        interviewId: interviewTemplateId,
        candidateName,
        answer,
        isFirstQuestion,
        dynamicTemplate,
        isNewQuestion,
        startTime,
        isInterviewTimeout
    }: InitializeInterviewInputTypes) {
        try {
            const pool = new pg.Pool({
                connectionString: process.env.DATABASE_URL
            });


            const newActivity = await this.activityRepository.save(
                this.activityRepository.create({
                    interviewTemplateId: interviewTemplateId,
                    startTime: new Date(),
                })
            );

            if (!newActivity.activityId) {
                throw new Error('Failed to generate activityId.');
            }


            let questionTime = 0;
            let preparationTime = 0;
            const currentQuestionNo = 1;
            const currentStageNo = 0;
            let isTimeLimited = dynamicTemplate.prompt[currentStageNo].isTimeLimited;
            const isQuizLimited = dynamicTemplate.prompt[currentStageNo].isQuizLimited;

            if (isTimeLimited) {
                preparationTime = dynamicTemplate.prompt[currentStageNo].preparationTime;
                questionTime = dynamicTemplate.prompt[currentStageNo].quizTime;
            }

            const prompt = dynamicTemplate.prompt[currentStageNo].promptTemplate;
            const validationTemplate = JSON.parse(dynamicTemplate.prompt[currentStageNo].validationTemplate);

            let initializeInterviewOutputStructure;
            // If pretext is and question are not in the validation template then throw an error
            if (!validationTemplate.pretext || !validationTemplate.question) {
                initializeInterviewOutputStructure = defaultInitializeInterviewOutputStructure;
            } else {
                // zod schema for the output structure
                initializeInterviewOutputStructure = z.object({
                    question: z.string().describe(validationTemplate.question),
                    pretext: z.string().describe(validationTemplate.pretext),
                });
            }




            const initializeInterviewParser = StructuredOutputParser.fromZodSchema(initializeInterviewOutputStructure);

            // Generate the first question and pretext for the interview
            const _DefaultTemplate = InterviewInitializationPrompt;
            const interviewPromptTemplate = new PromptTemplate({
                template: _DefaultTemplate,
                inputVariables: ["answer", "interviewMessageHistory"],
                partialVariables: {
                    dynamicTemplate: JSON.stringify(prompt),
                    candidateName: candidateName,
                    previousQuestions: JSON.stringify([]),
                    formattingInstructions: initializeInterviewParser.getFormatInstructions(),
                }
            });

            // Create a new chat message history 
            const pgMessageHistory = new PostgresChatMessageHistory({
                pool: pool,
                sessionId: newActivity.activityId,
            });

            const bufferWindowMemory = new BufferWindowMemory({
                chatHistory: pgMessageHistory,
                k: 10,
                memoryKey: "interviewMessageHistory",
                returnMessages: true,
            })

            const parser = new StringOutputParser();

            const interimInterviewFixingParser = OutputFixingParser.fromLLM(
                getOpenAIChatInstance(),
                initializeInterviewParser
            );

            const conversationChain = new ConversationChain({
                prompt: interviewPromptTemplate,
                llm: getOpenAIChatInstance(),
                memory: bufferWindowMemory,
                outputParser: parser,
            });

            const res = await conversationChain.invoke({ answer: [] });

            const structuredRes = await interimInterviewFixingParser.invoke(res.response);

            const { question, pretext } = structuredRes;

            let objectIds: number[] = [];
            try {
                // Get last two ids from the langchain_chat_histories table and in message column where message is a JSON object with a key "type". select the message where type is "ai"
                const query = `
                    SELECT id, message 
                    FROM langchain_chat_histories 
                    WHERE session_id = '${newActivity.activityId}' 
                    ORDER BY id DESC 
                    LIMIT 4
                `;

                const postgresClient = new pg.Client({
                    connectionString: process.env.DATABASE_URL
                });

                await postgresClient.connect().then(() => {
                    this.logger.log("Connected to the database");
                });

                const dbRes = await postgresClient.query(query);

                const rows = dbRes.rows;

                for (let row of rows) {
                    if (row.message.type === "ai") {
                        const content = JSON.parse(row.message.content);

                        if (content.question) {
                            objectIds.push(row.id);
                        }
                    }
                }

                await postgresClient.end().then(() => {
                    this.logger.log("Disconnected from the database");
                });

            } catch (error) {
                if (error instanceof Error) {
                    this.logger.error(error.message);
                    this.logger.error(error.stack);
                } else {
                    this.logger.error(error);
                }
            }

            // Response Payload
            const resPayload = {
                activityId: newActivity.activityId,
                pretext: `${pretext} Before we begin, please note: If you're silent for more than 5 seconds, we'll move to the next question.`,
                currentQuestion: question,
                isInterviewEndReceived: isInterviewTimeout,
                preparationTime: preparationTime,
                questionTime: questionTime,
                currentStageNo: currentStageNo,
                currentQuestionNo: currentQuestionNo,
                objectIds: objectIds,
                isTimeLimited: isTimeLimited,
                isQuizLimited: isQuizLimited,
            }

            return resPayload;
        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(error.message);
                this.logger.error(error.stack);
                throw error;
            } else {
                this.logger.error(error);
                throw new Error(`Failed to initialize interview. " ${String(error)}"`);
            }

        }
    }

    // MARK: Interim Interview
    async interimInterview({
        answer,
        candidateName,
        dynamicTemplate,
        category,
        isInterviewTimeout,
        isNewQuestion,
        questionNo,
        isQuizLimited,
        qnaObjectIds,
        stageNo,
        activityId,
        interimType
    }: InterimAnswerInputTypes) {
        const pool = new pg.Pool({
            connectionString: process.env.DATABASE_URL
        });

        const postgresClient = new pg.Client({
            connectionString: process.env.DATABASE_URL
        });

        // Create a new chat message history 
        const pgMessageHistory = new PostgresChatMessageHistory({
            pool: pool,
            sessionId: activityId,
        });

        await postgresClient.connect();

        const questionsList: string[] = [];



        let preparationTime = 0;
        let questionTime = 0;
        isQuizLimited = dynamicTemplate.prompt[stageNo].isQuizLimited;
        let currentQuestionNo = questionNo;
        let currentStageNo = stageNo;
        let isInterviewEndReceived = isInterviewTimeout;

        if (isQuizLimited) {
            const quizInStage = dynamicTemplate.prompt[currentStageNo].noOfQuiz;
            const totalStages = dynamicTemplate.prompt.length;

            if (questionNo < quizInStage) {
                currentQuestionNo = questionNo + 1;
            } else if (totalStages - 1 > stageNo) {
                currentQuestionNo = 1;
                currentStageNo = stageNo + 1;
            } else {
                isInterviewEndReceived = true;
            }
        }

        if (dynamicTemplate.prompt[currentStageNo].isTimeLimited) {
            preparationTime = dynamicTemplate.prompt[currentStageNo].preparationTime;
            questionTime = dynamicTemplate.prompt[currentStageNo].quizTime;
        }

        const prompt = dynamicTemplate.prompt[currentStageNo].promptTemplate;
        const validationTemplate = JSON.parse(dynamicTemplate.prompt[currentStageNo].validationTemplate);
        const isTimeLimited = dynamicTemplate.prompt[currentStageNo].isTimeLimited;
        const isQuestionLimited = dynamicTemplate.prompt[currentStageNo].isQuizLimited;
        const isNewQuiz = isNewQuestion;

        if (isTimeLimited) {
            preparationTime = dynamicTemplate.prompt[currentStageNo].preparationTime;
            questionTime = dynamicTemplate.prompt[currentStageNo].quizTime;
        }

        if(interimType === "end") {
            isInterviewEndReceived = true;
        }

        // If pretext is and question are not in the validation template then throw an error
        if (!validationTemplate.pretext || !validationTemplate.question) {
            throw new Error("Validation template not found");
        }


        // MARK: Set the output structure based on the interim type
        // zod schema for the output structure
        let interimInterviewOutputStructure;
        let _DefaultTemplate;

        if (interimType === "onGoing") {
            _DefaultTemplate = InterviewOngoingPrompt;

            // If pretext is and question are not in the validation template then throw an error
            if (!validationTemplate.pretext || !validationTemplate.question) {
                interimInterviewOutputStructure = defaultOnGoingInterimInterviewOutputStructure;
            } else {
                // zod schema for the output structure
                interimInterviewOutputStructure = z.object({
                    question: z.string().describe(validationTemplate.question),
                    pretext: z.string().describe(validationTemplate.pretext),
                });
            }
        } else if (interimType === "notAnswered") {
            _DefaultTemplate = InterviewNotAnsweredPrompt;
            interimInterviewOutputStructure = defaultNotAnsweredInterviewOutputStructure;

            answer = "User didn't answer the question";
        } else {
            _DefaultTemplate = InterviewEndPrompt;

            interimInterviewOutputStructure = defaultEndInterviewOutputStructure;
        }

        const interimInterviewParser = StructuredOutputParser.fromZodSchema(interimInterviewOutputStructure);

        const interimInterviewFixingParser = OutputFixingParser.fromLLM(
            getOpenAIChatInstance(),
            interimInterviewParser
        );

        const interviewPromptTemplate = new PromptTemplate({
            template: _DefaultTemplate,
            inputVariables: ["answer", "interviewMessageHistory"],
            partialVariables: {
                dynamicTemplate: JSON.stringify(prompt),
                candidateName: candidateName,
                questionList: JSON.stringify(questionsList),
                formattingInstructions: interimInterviewParser.getFormatInstructions(),
            }
        });

        const bufferWindowMemory = new BufferWindowMemory({
            chatHistory: pgMessageHistory,
            k: 10,
            memoryKey: "interviewMessageHistory",
            returnMessages: true,
        })

        const parser = new StringOutputParser();

        const conversationChain = new ConversationChain({
            prompt: interviewPromptTemplate,
            llm: getOpenAIChatInstance(),
            memory: bufferWindowMemory,
            outputParser: parser,
        });

        const res = await conversationChain.invoke({ answer: answer });

        const parsedRes = await interimInterviewFixingParser.invoke(res.response);

        const { pretext, question } = parsedRes;


        let objectIds: string[] = [];
        
        try {
            // Get last two question ids from the langchain_chat_histories table and in message column where message is a JSON object with a key "type". select the message where type is "ai"
            const query = `
                    SELECT id, message 
                    FROM langchain_chat_histories 
                    WHERE session_id = '${activityId}' 
                    ORDER BY id DESC 
                    LIMIT 4
                `;

            const postgresClient = new pg.Client({
                connectionString: process.env.DATABASE_URL
            });

            await postgresClient.connect().then(() => {
                this.logger.log("Connected to the database");
            });

            const dbRes = await postgresClient.query(query);

            const rows = dbRes.rows;

            for (let row of rows) {
                if (row.message.type === "ai") {
                    const content = JSON.parse(row.message.content);

                    if (content.question) {
                        objectIds.push(row.id);
                    }
                }
            }

            await postgresClient.end().then(() => {
                this.logger.log("Disconnected from the database");
            });

        } catch (error) {
            if (error instanceof Error) {
                this.logger.error(error.message);
                this.logger.error(error.stack);
            } else {
                this.logger.error(error);
            }
        }

        // Response Payload
        const resPayload = {
            activityId: activityId,
            pretext: pretext,
            currentQuestion: question,
            isInterviewEndReceived: isInterviewEndReceived,
            preparationTime: preparationTime,
            questionTime: questionTime,
            currentStageNo,
            currentQuestionNo: currentQuestionNo,
            qnaObjectIds: objectIds,
            isTimeLimited: isTimeLimited,
            isQuizLimited: isQuestionLimited,
            isNewQuestion: isNewQuiz,
        }


        if (interimType !== "onGoing" && interimType !== "notAnswered" && interimType !== "interrupted") {
            try {
                await pgMessageHistory.clear();
            } catch (error) {
                if (error instanceof Error) {
                    this.logger.error(error.message);
                    this.logger.error(error.stack);
                } else {
                    this.logger.error(error);
                }
            }
        }

        return resPayload;


    }
    // MARK: Answer from user
    answerFromUser({
        activityId,
        answer,
        answerGivenTime,
        currentAnswerDuration,
        currentQuestionTimeLimit,
        questionAskTime,
        question
    }: AnswerFromUserInputTypes) {
        return;
    }
}
