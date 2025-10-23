import { Module } from '@nestjs/common';
import { InterviewsService } from './interviews.service';
import { InterviewsGateway } from './interviews.gateway';
import { InterviewsGatewayService } from './interviewsGateway.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Interview, InterviewStage, Preferences, Validation } from './entities/interviews.entity';
import { DynamicPrompt } from 'src/dynamic-prompt/entities/dynamic-prompt.entity';
import { Activity } from 'src/activity/entities/activity.entity';
import { InterviewResolver } from './interviews.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Interview,
      InterviewStage,
      Preferences,
      Validation,
      DynamicPrompt,
      Activity
    ]),
  ],
  providers: [InterviewsGateway, InterviewsService, InterviewsGatewayService, InterviewResolver],
  exports: [InterviewsService, InterviewsGatewayService, InterviewsGateway],
})
export class InterviewsModule { }
