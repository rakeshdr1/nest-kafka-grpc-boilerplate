import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as grpc from '@grpc/grpc-js';

import { User } from './schemas/user.schema';
import { ResponseHandlerService } from '@shared/handlers/response-handlers';
import { UserAlreadyExists } from '@shared/http/message';
import { SignUpInput } from '../auth/dto/sign-up.dto';

const GrpcStatus = grpc.status;

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly responseHandlerService: ResponseHandlerService,
  ) {}

  async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findOne({ _id: id });

    if (!user) {
      return this.responseHandlerService.response(
        UserAlreadyExists,
        HttpStatus.NOT_FOUND,
        GrpcStatus.NOT_FOUND,
        null,
      );
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email });

    return user;
  }

  async create(data: SignUpInput): Promise<User> {
    const user = await this.userModel.create(data);

    return user;
  }
}
