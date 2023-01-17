import { Field, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsMongoId, IsOptional, IsString } from 'class-validator';

@InputType()
export class CreateActivityInput {
  readonly user?: string;

  @Field({ description: 'enter activity name' })
  @ApiProperty()
  @IsString()
  readonly name: string;

  @Field({ nullable: true, description: 'enter start time' })
  @IsOptional()
  @IsDateString()
  startTime: Date;

  @Field({ nullable: true, description: 'enter end time' })
  @IsOptional()
  @IsDateString()
  endTime: Date;
}

@InputType()
export class UpdateActivityInput {
  @Field({ description: 'enter activity id' })
  @ApiProperty()
  @IsMongoId()
  id: string;

  @Field({ nullable: true, description: 'enter activity name' })
  @IsOptional()
  @IsString()
  readonly name: string;

  @Field({ nullable: true, description: 'enter start time' })
  @IsOptional()
  @IsDateString()
  startTime: Date;

  @Field({ nullable: true, description: 'enter end time' })
  @IsOptional()
  @IsDateString()
  endTime: Date;
}
