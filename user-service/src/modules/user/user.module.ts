import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ResponseHandlerService } from '@shared/handlers/response-handlers';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService, ResponseHandlerService],
  exports: [UserService],
})
export class UserModule {}
