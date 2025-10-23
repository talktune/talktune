import { Test, TestingModule } from '@nestjs/testing';
import { TextToSpeechResolver } from './text-to-speech.resolver';
import { TextToSpeechService } from './text-to-speech.service';

describe('TextToSpeechResolver', () => {
  let resolver: TextToSpeechResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TextToSpeechResolver, TextToSpeechService],
    }).compile();

    resolver = module.get<TextToSpeechResolver>(TextToSpeechResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
