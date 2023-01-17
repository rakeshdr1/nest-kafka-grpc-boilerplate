import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  _id: string;

  @Field()
  email: string;

  @Field()
  name: string;

  @Field()
  password: string;

  @Field()
  lastLoginTime: string;

  @Field()
  createdAt: string;

  @Field()
  updatedAt: string;
}

@ObjectType()
export class Token {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;
}

@ObjectType()
export class AuthResponse extends Token {
  @Field(() => User, { description: 'users information' })
  readonly user: User;
}
