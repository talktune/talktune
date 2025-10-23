import { Module } from '@nestjs/common';
import { DynamicPromptService } from './dynamic-prompt.service';
import { DynamicPromptResolver } from './dynamic-prompt.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DynamicPrompt, DynamicPromptObject } from './entities/dynamic-prompt.entity';
import { Interview } from 'src/interviews/entities/interviews.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([DynamicPrompt, DynamicPromptObject, Interview]),
  ],
  providers: [DynamicPromptResolver, DynamicPromptService],
})
export class DynamicPromptModule { }
