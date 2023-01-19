import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

@InputType()
export class SignUpInput {
  @Field({ description: 'enter name' })
  @IsString()
  name: string;

  @Field({ description: 'enter email' })
  @IsEmail()
  @Transform(({ value }) => value.trim().toLowerCase())
  email: string;

  @Field({ description: 'enter password' })
  @IsString()
  @MinLength(8)
  password: string;
}
