import { Test, TestingModule } from '@nestjs/testing';
import { DynamicPromptResolver } from './dynamic-prompt.resolver';
import { DynamicPromptService } from './dynamic-prompt.service';

describe('DynamicPromptResolver', () => {
  let resolver: DynamicPromptResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicPromptResolver, DynamicPromptService],
    }).compile();

    resolver = module.get<DynamicPromptResolver>(DynamicPromptResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
