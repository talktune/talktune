import { z } from "zod";

export const defaultInitializeInterviewOutputStructure = z.object({
    question: z.string().describe("The interview question to ask the candidate."),
    pretext: z.string().describe("A user-friendly introduction with greeting to start the interview. Use the candidate's name if needed, but do not ask the question itself."),
});

export const defaultOnGoingInterimInterviewOutputStructure = z.object({
    question: z.string().describe("A well-phrased, user-friendly question to continue the interview."),
    pretext: z.string().describe("Brief feedback on the previous answer to smoothly transition to the next question. Use a maximum of 10 words and include the candidate's name if appropriate. Do not ask a question."),
});

export const defaultEndInterviewOutputStructure = z.object({
    question: z.string().describe("End the interview with a user-friendly message and greeting. don't ask any question.include the candidate's name if appropriate."),
    pretext: z.string().describe("Brief feedback on the previous answer. Use a maximum of 10 words and include the candidate's name if appropriate. Do not ask a question."),
});

export const defaultNotAnsweredInterviewOutputStructure = z.object({
    question: z.string().describe("A well-phrased, user-friendly question to continue the interview."),
    pretext: z.string().describe("Provide a brief sentence acknowledging the lack of answer but don't ask any question. Use a maximum of 10 words and include the candidate's name if appropriate."),
});

