import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';

@Injectable()
export class TextToSpeechService {
    async getTextToSpeech(text: string): Promise<any> {
        try {

            const ai_token = process.env.OPENAI_API_KEY;

            let VoiceId: any = 'shimmer';


            const openai = new OpenAI({
                apiKey: ai_token,
            });

            const response = await openai.audio.speech.create({
                model: 'tts-1',
                voice: VoiceId,
                input: text,
            });

            const base64Audio = Buffer.from(await response.arrayBuffer()).toString(
                'base64',
            );

            return base64Audio;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
