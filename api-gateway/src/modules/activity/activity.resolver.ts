import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';

import { AuthGuard, GetUserId } from '../user/guards/jwt.guard';
import { ActivityService } from './activity.service';
import { CreateActivityInput, UpdateActivityInput } from './dto/activity.dto';
import { ActivityResponse, MessageResponse } from './models/activity.model';

@Resolver(() => ActivityResponse)
export class ActivityResolver {
  constructor(private activityService: ActivityService) {}

  @Query(() => [ActivityResponse])
  @UseGuards(AuthGuard)
  async activitiesList(@GetUserId() userId) {
    const { activities } = await this.activityService.findAllByUser(userId);
    return activities;
  }

  @Mutation(() => MessageResponse)
  async createActivity(
    @Args('input') createActivityInput: CreateActivityInput,
    @GetUserId() userId,
  ) {
    return this.activityService.create({
      ...createActivityInput,
      user: userId,
    });
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard)
  async updateActivity(
    @Args('input') updateActivityInput: UpdateActivityInput,
  ) {
    return this.activityService.update({
      ...updateActivityInput,
    });
  }

  @Mutation(() => MessageResponse)
  @UseGuards(AuthGuard)
  async deleteActivity(@Args('id') id: string) {
    return this.activityService.remove(id);
  }
}
