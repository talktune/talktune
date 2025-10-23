"use client";

import { InterviewPreferencesType, MappedInterviewPreferencesType } from "@/interfaces/interview";
import { createContext, useContext, useMemo, useState } from "react";

interface InterviewContextProps {
    readonly children: React.ReactNode;
}

interface InterviewContextType {
    handleDynamicPromptRequest: (interviewTimeLimit: number, schema: any) => Promise<void>;
    setInterviewPreferences: (props: SetInterviewPreferencesProps) => void;
    interviewId: string;
    interviewLabel: string;
    timeLimit: number;
    category: string;
    interviewText: string;
    preferencesSchema: any;
    introduction: string[];
    userSelectedSchema: any;
    interviewTimeLimit: number;
    promptTemplateID: string;
    resetSchema: () => void;
    interviewStages: any[];
    isInterimEnabled: boolean;

}
interface SetInterviewPreferencesProps {
    headerText: string;
    interviewLabel: string;
    timeLimit: number;
    interviewCategory: string;
    id: string;
    interviewPreferencesSchema: InterviewPreferencesType[];
    intro: string[];
    template: string;
    stages: any[];
    isInterimEnable: boolean;
}

const InterviewContext = createContext<InterviewContextType | null>(null);

export function InterviewContextProvider({ children }: InterviewContextProps) {
    const [interviewId, setInterviewId] = useState<string>("");
    const [interviewLabel, setInterviewLabel] = useState<string>("");
    const [timeLimit, setTimeLimit] = useState(0);
    const [category, setCategory] = useState("");
    const [interviewText, setInterviewText] = useState("");
    const [preferencesSchema, setPreferencesSchema] = useState<MappedInterviewPreferencesType[]>([]);
    const [userSelectedSchema, setUserSelectedSchema] = useState({});
    const [introduction, setIntroduction] = useState<string[]>([]);
    const [interviewTimeLimit, setInterviewTimeLimit] = useState(0);
    const [promptTemplateID, setPromptTemplateID] = useState("");
    const [interviewStages, setInterviewStages] = useState<any[]>([]);
    const [isInterimEnabled, setIsInterimEnabled] = useState(true);

    const handleDynamicPromptRequest = async (
        interviewTimeLimit: number,
        schema: any
    ) => {
        return new Promise<void>((resolve) => {
            setUserSelectedSchema(schema);
            setInterviewTimeLimit(interviewTimeLimit);

            resolve();
        });
    };

    const resetSchema = () => {
        setUserSelectedSchema({});
    };

    const setInterviewPreferences = (
        {
            headerText,
            interviewLabel,
            timeLimit,
            interviewCategory,
            id,
            interviewPreferencesSchema,
            intro,
            template,
            stages,
            isInterimEnable
        }: SetInterviewPreferencesProps
    ) => {

        const mappedSchema: MappedInterviewPreferencesType[] = interviewPreferencesSchema.map((schema: InterviewPreferencesType) => {
            return {
                name: schema.name,
                type: schema.type,
                defaultValue: schema.defaultValue,
                label: schema.label,
                removeOption: schema.removeOption,
                addNewOption: schema.addNewOption,
                indexNo: schema.indexNo,
                options: schema.options,
                validation: schema.validation[0]
            };

        });

        setInterviewText(headerText);
        setInterviewStages(stages);
        setInterviewLabel(interviewLabel);
        setTimeLimit(timeLimit);
        setCategory(interviewCategory);
        setInterviewId(id);
        setPreferencesSchema(mappedSchema);
        setIntroduction(intro);
        setPromptTemplateID(template);
        setIsInterimEnabled(isInterimEnable);
    };

    // Context values
    const interviewContextValues = useMemo(() => {
        return {
            interviewId,
            interviewLabel,
            timeLimit,
            category,
            interviewText,
            preferencesSchema,
            introduction,
            userSelectedSchema,
            interviewTimeLimit,
            promptTemplateID,
            interviewStages,
            isInterimEnabled,
            handleDynamicPromptRequest,
            setInterviewPreferences,
            resetSchema,
        };
    }, [
        interviewId,
        interviewLabel,
        timeLimit,
        category,
        interviewText,
        preferencesSchema,
        introduction,
        userSelectedSchema,
        interviewTimeLimit,
        promptTemplateID,
        interviewStages,
        isInterimEnabled
    ]);

    return (
        <InterviewContext.Provider value={interviewContextValues}>
            {children}
        </InterviewContext.Provider>
    );
}

export function useInterviewContext() {
    const context = useContext(InterviewContext);
    if (!context) {
        throw new Error("useInterviewContext must be used within InterviewContextProvider");
    }
    return context;
}
