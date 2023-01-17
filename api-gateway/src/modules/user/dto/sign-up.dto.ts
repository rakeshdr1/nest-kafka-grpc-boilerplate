import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class SignUpInput {
  @Field()
  @IsString()
  name: string;

  @Field()
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @Field()
  @IsString()
  @MinLength(8)
  readonly password: string;
}
