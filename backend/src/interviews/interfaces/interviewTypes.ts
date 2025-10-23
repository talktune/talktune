export interface InitializeInterviewInputTypes {
    interviewId: string,
    candidateName: string,
    answer: string,
    isFirstQuestion: boolean,
    dynamicTemplate: DynamicPrompt,
    isNewQuestion: boolean,
    startTime: number,
    isInterviewTimeout: boolean,
}

export interface InterimAnswerInputTypes {
    answer: string;
    candidateName: string;
    dynamicTemplate: DynamicPrompt;
    category: string;
    isInterviewTimeout: boolean;
    isNewQuestion: boolean;
    questionNo: number;
    isQuizLimited: boolean;
    qnaObjectIds: string[];
    stageNo: number;
    activityId: string;
    interimType: "onGoing" | "notAnswered" | "end" | "interrupted";
}

export interface AnswerFromUserInputTypes {
    answer: string;
    question: string;
    currentQuestionTimeLimit: number;
    currentAnswerDuration: number;
    answerGivenTime: number;
    questionAskTime: number;
    activityId: string;
}

interface InterviewDataType {
    activityId: string;
    answer: string;
    isNewQuestion: boolean;
}
export interface OngoingInterviewInputTypes extends InterviewDataType {
    currentQuizNo: number;
    qnaObjectIds: string[];
}

export interface WebSocketPayloadDataType {
    message: InitializeInterviewMessageType | AnswerFromUserMessageType | InterimAnswerMessageType;
    requestMethod: RequestTypes;
}

export interface InitializeInterviewMessageType {
    qnaObjectIds: string[];
    currentTime: number;
    timeLimit: number;
    interviewText: string;
    startTime: number;
    interviewId: string;
    isNewQuestion: boolean;
    category: string;
    dynamicTemplate: DynamicPrompt;
    candidateName: string;
    isInterviewTimeout: boolean;
}

export type RequestTypes = "initializeInterview" | "answerFromUser" | "interimAnswer";

export interface AnswerFromUserMessageType {
    answer: string;
    question: string;
    currentQuestionTimeLimit: number;
    currentAnswerDuration: number;
    answerGivenTime: number;
    questionAskTime: number;
    activityId: string;
}

export interface InterimAnswerMessageType {
    qnaObjectIds: string[];
    activityId: string;
    dynamicTemplate: DynamicPrompt;
    questionNo: number;
    category: string;
    stageNo: number;
    isInterviewTimeout: boolean;
    isNewQuestion: boolean;
    answer: string;
    candidateName: string;
    isQuizLimited: boolean;
    interimType: "onGoing" | "notAnswered" | "end" | "interrupted";
}
export interface DynamicPrompt {
    id: string;
    prompt: DynamicPromptObject[];
    promptName: string;
}

export interface DynamicPromptObject {
    isTimeLimited: boolean;
    isQuizLimited: boolean;
    preparationTime: number;
    quizTime: number;
    promptTemplate: string;
    validationTemplate: string;
    noOfQuiz: number;
    stageNumber: number;
}
