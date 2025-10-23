import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DynamicPromptService } from './dynamic-prompt.service';
import { DynamicPrompt } from './entities/dynamic-prompt.entity';
import { GenerateDynamicPromptInput } from './dto/generate-dynamic-prompt.input';
import { CreateDynamicPromptInput } from './dto/create-dynamic-prompt.input';


@Resolver(() => DynamicPrompt)
export class DynamicPromptResolver {
  constructor(private readonly dynamicPromptService: DynamicPromptService) { }

  @Mutation(() => DynamicPrompt)
  async createDynamicPrompt(
    @Args('createDynamicPromptInput')
    createDynamicPromptInput: CreateDynamicPromptInput,
  ) {
    return this.dynamicPromptService.create(createDynamicPromptInput);
  }

  @Mutation(() => DynamicPrompt)
  async generateDynamicPrompt(
    @Args('generateDynamicPromptInput')
    generateDynamicPromptInput: GenerateDynamicPromptInput,
  ) {
    return this.dynamicPromptService.generateDynamicPromptInput(
      generateDynamicPromptInput,
    );
  }
}
