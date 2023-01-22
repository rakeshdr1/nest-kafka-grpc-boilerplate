import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Activity extends Document {
  @Prop()
  user: string;

  @Prop({ required: true })
  name: string;

  @Prop()
  startTime?: Date;

  @Prop()
  endTime?: Date;
}

const ActivitySchema = SchemaFactory.createForClass(Activity);
export { ActivitySchema };
