import { InputType, Field, ID } from '@nestjs/graphql';

@InputType()
export class CreateDynamicPromptObjectInput {
  @Field(() => ID, { nullable: true, description: 'Optional ID for the dynamic prompt object' })
  id?: string;

  @Field(() => Number, { nullable: true, description: 'Stage number' })
  stageNumber?: number;

  @Field(() => Number, { nullable: true, description: 'Number of quizzes' })
  noOfQuiz?: number;

  @Field(() => Number, { nullable: true, description: 'Preparation time' })
  preparationTime?: number;

  @Field(() => Number, { nullable: true, description: 'Quiz time' })
  quizTime?: number;

  @Field(() => String, { nullable: true, description: 'Prompt template' })
  promptTemplate?: string;

  @Field(() => Boolean, { description: 'Indicates if time is limited' })
  isTimeLimited: boolean;

  @Field(() => Boolean, { description: 'Indicates if quiz is limited' })
  isQuizLimited: boolean;

  @Field(() => String, { nullable: true, description: 'Validation template' })
  validationTemplate?: string;
}

@InputType()
export class CreateDynamicPromptInput {
  @Field(() => String, { description: 'Name of the prompt' })
  promptName: string;

  @Field(() => [CreateDynamicPromptObjectInput], { description: 'Prompt objects' })
  prompt: CreateDynamicPromptObjectInput[];
}