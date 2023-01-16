import { Field, InputType } from '@nestjs/graphql';

import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class SignUpInput {
  @Field()
  readonly name: string;

  @Field()
  @IsEmail()
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
