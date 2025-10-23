import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TextToSpeechService } from './text-to-speech.service';

@Resolver()
export class TextToSpeechResolver {
  constructor(private readonly textToSpeechService: TextToSpeechService) {}

  @Mutation(() => String)
  async textToSpeech(
    @Args('text') text: string, // Correct way to handle the 'text' argument
  ): Promise<string> {
    return this.textToSpeechService.getTextToSpeech(text);
  }
}
