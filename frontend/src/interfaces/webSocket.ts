export interface WebSocketResponsePayloadType {
    activityId: string;
    pretext: string;
    currentQuestion: string;
    isInterviewEndReceived: boolean;
    preparationTime: number;
    questionTime: number;
    currentStageNo: number;
    currentQuestionNo: number;
    objectIds: string[];
    isTimeLimited: boolean;
    isQuizLimited: boolean;
}

export interface InitializeInterviewWebSocketResponsePayloadType extends WebSocketResponsePayloadType { }

export interface InterimAnswerWebSocketResponsePayloadType extends WebSocketResponsePayloadType {
    qnaObjectIds?: string[];
    isNewQuestion?: boolean;
}


export interface WebSocketPayloadDataType {
    message: InitializeInterviewMessageType | AnswerFromUserMessageType | InterimAnswerMessageType;
    requestMethod: RequestTypes;
}

export type RequestTypes = "initializeInterview" | "answerFromUser" | "interimAnswer";

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