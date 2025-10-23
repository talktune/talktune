import { Module } from '@nestjs/common';
import { DbStartupService } from './db-startup.service';
import { InterviewsService } from 'src/interviews/interviews.service';
import { DynamicPromptService } from 'src/dynamic-prompt/dynamic-prompt.service';
import { InterviewsModule } from 'src/interviews/interviews.module';
import { DynamicPromptModule } from 'src/dynamic-prompt/dynamic-prompt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview, InterviewStage, Preferences, Validation } from 'src/interviews/entities/interviews.entity';
import { DynamicPrompt, DynamicPromptObject } from 'src/dynamic-prompt/entities/dynamic-prompt.entity';

@Module({
  imports: [
    InterviewsModule,
    DynamicPromptModule,
    TypeOrmModule.forFeature([
      Interview,
      InterviewStage,
      Preferences,
      Validation,
      DynamicPrompt,
      DynamicPromptObject
    ]),
  ],
  providers: [DbStartupService, InterviewsService, DynamicPromptService],
})
export class DbStartupModule { }
