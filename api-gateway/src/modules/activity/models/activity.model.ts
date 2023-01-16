import { Directive, Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'activity ' })
export class ActivityResponse {
  @Field()
  _id: string;

  @Field()
  name: string;

  @Field()
  user: string;

  @Field({ nullable: true })
  startTime: Date;

  @Field({ nullable: true })
  endTime: Date;

  @Field({ nullable: true })
  createdAt: Date;

  @Field({ nullable: true })
  updatedAt: Date;
}
