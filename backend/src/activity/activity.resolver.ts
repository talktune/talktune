import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ActivityService } from './activity.service';
import { CreateActivityInput } from './dto/create-activity.input';
import { UpdateActivityInput } from './dto/update-activity.input';
import { Activity } from './entities/activity.entity';

@Resolver('Activity')
export class ActivityResolver {
  constructor(private readonly activityService: ActivityService) {}

  @Mutation(() => Activity)
  create(@Args('createActivityInput') createActivityInput: CreateActivityInput) {
    return this.activityService.create(createActivityInput);
  }
}
