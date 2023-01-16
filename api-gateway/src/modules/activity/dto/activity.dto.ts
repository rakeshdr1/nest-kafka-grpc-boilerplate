import { Field } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreateActivityInput {
  @Field()
  @ApiProperty()
  @IsString()
  readonly name: string;

  @Field()
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  startTime: Date;

  @Field()
  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  endTime: Date;
}
