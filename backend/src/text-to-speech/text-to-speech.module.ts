import { Module } from '@nestjs/common';
import { TextToSpeechService } from './text-to-speech.service';
import { TextToSpeechResolver } from './text-to-speech.resolver';

@Module({
  providers: [TextToSpeechResolver, TextToSpeechService],
  exports: [TextToSpeechService]
})
export class TextToSpeechModule {}
