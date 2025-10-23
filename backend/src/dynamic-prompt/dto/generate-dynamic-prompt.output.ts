import { Field, ObjectType } from '@nestjs/graphql';
import { DynamicPrompt } from '../entities/dynamic-prompt.entity';

@ObjectType()
export class GenerateDynamicPromptObjectOutput {
    @Field(() => String, { description: 'interveiw_id' })
    interviewId: string;

    @Field(() => DynamicPrompt, { description: 'Preferences schema' })
    dynamicPrompt: DynamicPrompt;
}
