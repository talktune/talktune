export interface Interview {
    interviewId: string;
    interviewLabel: string;
    category: string;
    skill_set: string[];
    created: string;
    interviewText: string;
    description: string;
    tagContents: string[]
    imageUrl: string;
    isTimeLimited: boolean;
    timeLimit: number;
    preferences: InterviewPreferencesType[];
    introduction: string[];
    dynamicTemplateId: string;
    interviewStages: any;
    isInterimEnabled: boolean;
    id: number;
    title: string;
    duration: string;
    tags: string[];
}


export interface InterviewPreferencesType {
    name: string;
    type: string;
    defaultValue: string[];
    label: string;
    removeOption: boolean;
    addNewOption: boolean;
    indexNo: number;
    options: string[];
    validation: {
        required: boolean;
        min: number;
        max: number;
    }[]
}

export interface MappedInterviewPreferencesType {
    name: string;
    type: string;
    defaultValue: string[];
    label: string;
    removeOption: boolean;
    addNewOption: boolean;
    indexNo: number;
    options: string[];
    validation: {
        required: boolean;
        min: number;
        max: number;
    }
}