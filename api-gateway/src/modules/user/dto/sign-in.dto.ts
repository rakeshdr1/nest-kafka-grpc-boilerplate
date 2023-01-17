import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
  @Field()
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
