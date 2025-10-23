export interface DynamicPrompt {
    stageNumber: number;
    noOfQuiz: number;
    preparationTime: number;
    quizTime: number;
    promptTemplate: string;
    isTimeLimited: boolean;
    isQuizLimited: boolean;
}