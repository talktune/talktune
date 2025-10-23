import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class GenerateDynamicPromptInput {
    @Field(() => String, { description: 'prompt_id' })
    promptId: string;

    @Field(() => String, { description: 'preferencesSchema' })
    preferencesSchema: string;
}