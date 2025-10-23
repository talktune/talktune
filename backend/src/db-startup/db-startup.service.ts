import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { CreateDynamicPromptInput } from 'src/dynamic-prompt/dto/create-dynamic-prompt.input';
import { DynamicPromptService } from 'src/dynamic-prompt/dynamic-prompt.service';
import { CreateInterviewInput } from 'src/interviews/dtos/create-interview.input';
import { InterviewsService } from 'src/interviews/interviews.service';

@Injectable()
export class DbStartupService implements OnApplicationBootstrap {
    constructor(
        private readonly dynamicPromptService: DynamicPromptService,
        private readonly interviewsService: InterviewsService,
    ) { }

    async onApplicationBootstrap() {
        const createDynamicPromptInput: CreateDynamicPromptInput[] = [{
            promptName: "softwareEngineering",
            prompt: [
                {
                    stageNumber: 1,
                    noOfQuiz: 0,
                    preparationTime: 0,
                    quizTime: 0,
                    promptTemplate: "You are an AI interview agent conducting an interview for the role of {{role}}. The candidate has applied for this position and possesses the following key skills: {{skills_set}}. The job description for this role includes: {{job_description}}. The candidate is {{work_experience}} in this field. Your task is to ask relevant and insightful questions to assess the candidate's proficiency in the required skills, their understanding of the job responsibilities, and their overall suitability for the role. Ensure that your questions are open-ended and encourage the candidate to provide detailed responses. Be professional and maintain a conversational tone throughout the interview. Do not ask any questions beyond the facts stated above.",
                    validationTemplate: "{\"question\":\"A well-phrased, user-friendly question to continue the interview.\",\"pretext\":\"Brief feedback on the previous answer to smoothly transition to the next question. Use a maximum of 10 words and include the candidate's name if appropriate. Do not ask a question.\"}",
                    isTimeLimited: false,
                    isQuizLimited: false
                }
            ]
        },
        {
            promptName: "generalInterview",
            prompt: [
                {
                    stageNumber: 1,
                    noOfQuiz: 0,
                    preparationTime: 0,
                    quizTime: 0,
                    promptTemplate: "You are an AI interview agent conducting an general interview . The candidate has possesses the following key skills: {{skills_set}}. The job description for this role includes: {{job_description}}. Your task is to ask relevant and insightful questions to assess the candidate's proficiency in the required skills, their understanding of the job responsibilities, and their overall suitability for the role. Ensure that your questions are open-ended and encourage the candidate to provide detailed responses. Be professional and maintain a conversational tone throughout the interview. Do not ask any questions beyond the facts stated above.",
                    validationTemplate: "{\"question\":\"A well-phrased, user-friendly question to continue the interview.\",\"pretext\":\"Brief feedback on the previous answer to smoothly transition to the next question. Use a maximum of 10 words and include the candidate's name if appropriate. Do not ask a question.\"}",
                    isTimeLimited: false,
                    isQuizLimited: false
                }
            ]
        }

        ]

        const createInterviews: CreateInterviewInput[] = [
            {
                category: "interviewCenter",
                introduction: [],
                description: "Prepare for your Software Engineer interview with system design questions, and problem-solving scenarios. Demonstrate your expertise in algorithms, data structures, and technical skills to stand out to employers.",
                interviewText: "Software Engineer",
                interviewLabel: "softwareEngineer",
                isInterimEnabled: true,
                imageUrl: "softwareEngineer.svg",
                isTimeLimited: true,
                timeLimit: 10,
                dynamicTemplateId: "",
                tagContents: [
                    "DevOps",
                    "Backend",
                    "Frontend",
                    "Full Stack"
                ],
                interviewStages: [
                    {
                        stageNumber: 1,
                        stage: "Easy",
                        numberOfQuestions: 3,
                        isStageInOrder: false
                    },
                    {
                        stageNumber: 2,
                        stage: "Moderate",
                        numberOfQuestions: 1,
                        isStageInOrder: false
                    },
                    {
                        stageNumber: 3,
                        stage: "Difficult",
                        numberOfQuestions: 3,
                        isStageInOrder: false
                    }
                ],
                preferences: [
                    {
                        name: "work_experience",
                        type: "button-group",
                        defaultValue: ["Junior(0 - 3 yrs)"],
                        label: "Work experience",
                        options: [
                            "Junior (0-3 yrs)",
                            "Mid (3-5 yrs)",
                            "Senior (5+ yrs)"
                        ],
                        validation: {
                            required: true
                        },
                        indexNo: 3,
                        removeOption: false,
                        addNewOption: false
                    },
                    {
                        name: "interviewTimeLimit",
                        type: "button-group",
                        defaultValue: ["15 Min"],
                        label: "Interview Duration",
                        options: [
                            "5 Min",
                            "15 Min",
                            "30 Min"
                        ],
                        validation: {
                            required: true
                        },
                        indexNo: 1,
                        removeOption: false,
                        addNewOption: false
                    },
                    {
                        name: "role",
                        type: "button-group",
                        defaultValue: ["Frontend Developer"],
                        label: "Role",
                        options: [
                            "Frontend Developer",
                            "Backend Developer",
                            "Full Stack Developer",
                            "Mobile Developer",
                            "DevOps Engineer"
                        ],
                        validation: {
                            required: true
                        },
                        indexNo: 2,
                        removeOption: false,
                        addNewOption: false
                    },
                    {
                        name: "skills_set",
                        type: "add-group",
                        defaultValue: ["JavaScript", "Testing"],
                        label: "Skills to test",
                        options: [
                            "JavaScript",
                            "Testing",
                            "Databases",
                            "Data Structures",
                            "Algorithms"
                        ],
                        addNewOption: true,
                        removeOption: true,
                        validation: {
                            required: true,
                            min: 1
                        },
                        indexNo: 4
                    },
                    {
                        name: "job_description",
                        type: "textarea",
                        label: "Job Description",
                        placeHolder: "Enter job description",
                        defaultValue: [],
                        options: [],
                        addNewOption: false,
                        removeOption: false,
                        validation: {
                            required: false
                        },
                        indexNo: 5
                    }
                ]
            },
            {
                category: "interviewCenter",
                introduction: [],
                description: "Our dashboard offers an overview of your SaaS business.",
                interviewText: "General Interview",
                interviewLabel: "generalInterview",
                isInterimEnabled: true,
                imageUrl: "generalInterview.png",
                isTimeLimited: true,
                timeLimit: 10,
                dynamicTemplateId: "",
                tagContents: [
                    "Research",
                    "Communication",
                    "Information Management",
                ],
                interviewStages: [
                    {
                        stageNumber: 1,
                        stage: "Easy",
                        numberOfQuestions: 3,
                        isStageInOrder: false
                    },
                    {
                        stageNumber: 2,
                        stage: "Moderate",
                        numberOfQuestions: 1,
                        isStageInOrder: false
                    },
                    {
                        stageNumber: 3,
                        stage: "Difficult",
                        numberOfQuestions: 3,
                        isStageInOrder: false
                    }
                ],
                preferences: [
                    {
                        name: "interviewTimeLimit",
                        type: "button-group",
                        defaultValue: ["15 Min"],
                        label: "Interview Duration",
                        options: [
                            "5 Min",
                            "15 Min",
                            "30 Min"
                        ],
                        validation: {
                            required: true
                        },
                        indexNo: 1,
                        removeOption: false,
                        addNewOption: false
                    },
                    {
                        name: "skills_set",
                        type: "add-group",
                        defaultValue: [
                            "Communication Skill",
                            "Emotional Intelligence",
                        ],
                        label: "Skills to test",
                        options: [
                            "Research Skill",
                            "Communication Skill",
                            "Emotional Intelligence",
                            "Information Management",
                            "Problem Solving"
                        ],
                        addNewOption: true,
                        removeOption: true,
                        validation: {
                            required: true,
                            min: 1
                        },
                        indexNo: 2
                    },
                    {
                        name: "job_description",
                        type: "textarea",
                        label: "Job Description",
                        placeHolder: "Enter job description",
                        defaultValue: [],
                        options: [],
                        addNewOption: false,
                        removeOption: false,
                        validation: {
                            required: false
                        },
                        indexNo: 3
                    }
                ]
            }

        ];

        try {

            for (let i = 0; i < createInterviews.length; i++) {
                const interview = await this.interviewsService.getInterviewByLabel(createInterviews[i].interviewLabel);

                if (!interview) {
                    const result = await this.dynamicPromptService.create(createDynamicPromptInput[i]);
                    createInterviews[i].dynamicTemplateId = result.id;

                    await this.interviewsService.createInterview(createInterviews[i]);
                }
            }
        } catch (error) {
            console.error('Error creating initial dynamic prompt:', error);
        }

    }
}
