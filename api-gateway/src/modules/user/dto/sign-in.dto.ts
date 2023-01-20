import { Field, InputType } from '@nestjs/graphql';
import { Transform } from 'class-transformer';
import { IsEmail, IsString, MinLength } from 'class-validator';

@InputType()
export class SignInInput {
  @Field({ description: 'enter email' })
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @Field({ description: 'enter password' })
  @IsString()
  @MinLength(8)
  password: string;
}

export interface ClientRequestInfo {
  browserId: string;
  userAgent: string;
}
