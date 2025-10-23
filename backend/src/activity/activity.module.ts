import { Module } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { ActivityResolver } from './activity.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Activity } from './entities/activity.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Activity]),
  ],
  providers: [ActivityResolver, ActivityService],
  exports: [ActivityService],
})
export class ActivityModule { }
