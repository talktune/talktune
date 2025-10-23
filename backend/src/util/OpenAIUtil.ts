import { ChatOpenAI } from "@langchain/openai";

export function getOpenAIChatInstance(): ChatOpenAI {
    const openAImodel = new ChatOpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        modelName: "gpt-4o-mini",
        temperature: 0.5,
    });

    return openAImodel;
}