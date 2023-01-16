import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateActivityInput {
  @Field()
  @ApiProperty()
  @IsString()
  readonly name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startTime: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endTime: Date;
}

@InputType()
export class UpdateActivityInput {
  @Field()
  @ApiProperty()
  @IsMongoId()
  id: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  readonly name: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  startTime: Date;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endTime: Date;
}
