import { UseGuards } from '@nestjs/common';
import { Resolver, Query } from '@nestjs/graphql';
import { GraphqlJwtAuthGuard } from '../user/guards/graphql-jwt-auth.guard';

import { ActivityService } from './activity.service';
import { ActivityResponse } from './models/activity.model';

@Resolver(() => ActivityResponse)
export class ActivityResolver {
  constructor(private activityService: ActivityService) {}

  @Query(() => [ActivityResponse])
  async activitiesList() {
    const { activities } = await this.activityService.findAllByUser(
      '63bb9c2039b461a9fb531ff0',
    );
    return activities;
  }

  //   @Mutation(() => Post)
  //   async createPost(
  //     @Args('input') createPostInput: CreatePostInput,
  //     @Context() context: { req: RequestWithUser },
  //   ) {
  //     return this.postsService.createPost(createPostInput, context.req.user);
  //   }
}
