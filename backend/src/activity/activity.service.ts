import { Injectable, Logger } from '@nestjs/common';
import { CreateActivityInput } from './dto/create-activity.input';
import { Repository } from 'typeorm';
import { Activity } from './entities/activity.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ActivityService {
  private readonly logger: Logger;

  // MARK: Constructor
  constructor(
    @InjectRepository(Activity)
    private readonly activityRepository: Repository<Activity>,
  ) {
    this.logger = new Logger("InterviewsService");
  }
  create(createActivityInput: CreateActivityInput) {
    const newActivity = this.activityRepository.create(createActivityInput);

    return this.activityRepository.save(newActivity);
  }
}
