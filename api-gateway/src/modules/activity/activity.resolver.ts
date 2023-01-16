import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { User } from '../user/decorators/user.decorator';
import { AuthGuard } from '../user/guards/jwt.guard';
import { ActivityService } from './activity.service';
import { CreateActivityInput, UpdateActivityInput } from './dto/activity.dto';
import { ActivityResponse, SuccessResponse } from './models/activity.model';

@Resolver(() => ActivityResponse)
export class ActivityResolver {
  constructor(private activityService: ActivityService) {}

  @Query(() => [ActivityResponse])
  @UseGuards(AuthGuard)
  async activitiesList(@User() userId) {
    const { activities } = await this.activityService.findAllByUser(userId);
    return activities;
  }

  @Mutation(() => SuccessResponse)
  async createActivity(
    @Args('input') createActivityInput: CreateActivityInput,
    @User() userId,
  ) {
    return this.activityService.create({
      ...createActivityInput,
      user: userId,
    });
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(AuthGuard)
  async updateActivity(
    @Args('input') updateActivityInput: UpdateActivityInput,
  ) {
    return this.activityService.update({
      ...updateActivityInput,
    });
  }

  @Mutation(() => SuccessResponse)
  @UseGuards(AuthGuard)
  async deleteActivity(@Args('id') id: string) {
    return this.activityService.remove(id);
  }
}
