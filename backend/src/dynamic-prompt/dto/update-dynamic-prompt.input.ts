import { CreateDynamicPromptInput } from './create-dynamic-prompt.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateDynamicPromptInput extends PartialType(CreateDynamicPromptInput) {
  @Field(() => Int)
  id: number;
}
