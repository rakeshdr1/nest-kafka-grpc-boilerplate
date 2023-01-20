import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AuthToken extends Document {
  @Prop({ required: true })
  user: string;

  @Prop({ required: true, unique: true, index: true })
  authToken: string;

  @Prop()
  browserId: string;

  @Prop()
  userAgent: string;

  @Prop({ default: true })
  valid: boolean;
}

const AuthTokenSchema = SchemaFactory.createForClass(AuthToken);
export { AuthTokenSchema };
