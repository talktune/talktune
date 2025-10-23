import { Test, TestingModule } from '@nestjs/testing';
import { DynamicPromptService } from './dynamic-prompt.service';

describe('DynamicPromptService', () => {
  let service: DynamicPromptService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DynamicPromptService],
    }).compile();

    service = module.get<DynamicPromptService>(DynamicPromptService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
