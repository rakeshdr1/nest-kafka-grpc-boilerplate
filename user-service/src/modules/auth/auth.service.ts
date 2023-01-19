import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import * as grpc from '@grpc/grpc-js';
import * as bcrypt from 'bcryptjs';

import { TokensResponse } from './dto/token-response.dto';
import { User } from '../user/schemas/user.schema';
import { ClientRequestInfo, SignInInput } from './dto/sign-in.dto';
import { CONSTANTS } from '@shared/constants';
import { ResponseHandlerService } from '@shared/handlers/response-handlers';
import { UserService } from '../user/user.service';
import {
  DeviceSessionExpired,
  InvalidCredentials,
  UserAlreadyExists,
  UserNotExist,
} from '@shared/http/message';
import { InjectModel } from '@nestjs/mongoose';
import { AuthToken } from './auth-token.schema';
import { Model } from 'mongoose';
import { SignUpInput } from './dto/sign-up.dto';

const GrpcStatus = grpc.status;

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(AuthToken.name)
    private readonly authTokenModel: Model<AuthToken>,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationClient: ClientKafka,
    private readonly responseHandlerService: ResponseHandlerService,
  ) {}

  async signUp(
    signUpInput: SignUpInput,
    requestInfo: ClientRequestInfo,
  ): Promise<TokensResponse> {
    const userData = await this.userService.findOneByEmail(signUpInput.email);

    if (userData) {
      return this.responseHandlerService.response(
        UserAlreadyExists,
        HttpStatus.CONFLICT,
        GrpcStatus.ALREADY_EXISTS,
        null,
      );
    }

    const hashedPassword = await bcrypt.hash(signUpInput.password, 7);
    const user = await this.userService.create({
      ...signUpInput,
      password: hashedPassword,
    });

    this.notificationClient.emit(
      CONSTANTS.KAFKA_TOPICS.USER.USER_CREATED,
      JSON.stringify(signUpInput),
    );

    const tokens = await this.generateTokens(user, requestInfo);
    return { user, ...tokens };
  }

  async signIn(
    signInInput: SignInInput,
    requestInfo: ClientRequestInfo,
  ): Promise<TokensResponse> {
    const user = await this.verifyUser(signInInput.email, signInInput.password);

    const tokens = await this.generateTokens(user, requestInfo);

    return { user, ...tokens };
  }

  async verifyUser(email: string, password: string): Promise<User> {
    const user = await this.userService.findOneByEmail(email);

    if (!user) {
      return this.responseHandlerService.response(
        UserNotExist,
        HttpStatus.NOT_FOUND,
        GrpcStatus.NOT_FOUND,
        null,
      );
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return this.responseHandlerService.response(
        InvalidCredentials,
        HttpStatus.UNAUTHORIZED,
        GrpcStatus.UNAUTHENTICATED,
        null,
      );
    }

    return user;
  }

  async verifyAccessToken(accessToken: string, requestInfo: ClientRequestInfo) {
    let payload;
    try {
      payload = await this.jwtService.verifyAsync(accessToken, {
        secret: this.configService.get('JWT_ACCESS_SECRET'),
      });
    } catch (err) {
      return this.responseHandlerService.response(
        err.message,
        HttpStatus.UNAUTHORIZED,
        GrpcStatus.UNAUTHENTICATED,
        null,
      );
    }
    const user = await this.userService.findOne(payload.id);
    if (!user) {
      return this.responseHandlerService.response(
        UserAlreadyExists,
        HttpStatus.NOT_FOUND,
        GrpcStatus.NOT_FOUND,
        null,
      );
    }

    const sessionInfo = await this.authTokenModel.findOne({
      authToken: accessToken,
      ...requestInfo,
      valid: true,
    });

    if (!sessionInfo) {
      return this.responseHandlerService.response(
        DeviceSessionExpired,
        HttpStatus.UNAUTHORIZED,
        GrpcStatus.UNAUTHENTICATED,
        null,
      );
    }

    if (user.lastLoginTime.getTime() > new Date(payload.loginTime).getTime()) {
      return this.responseHandlerService.response(
        DeviceSessionExpired,
        HttpStatus.UNAUTHORIZED,
        GrpcStatus.UNAUTHENTICATED,
        null,
      );
    }

    return { id: payload.id };
  }

  private async generateTokens(user: User, requestInfo: ClientRequestInfo) {
    const { _id } = user;
    const loginTime = new Date();
    const payload = { id: _id, loginTime };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_ACCESS_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_EXPIRE'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRE'),
    });

    const tokens = { accessToken, refreshToken };
    user.lastLoginTime = loginTime;
    await user.save();

    await this.authTokenModel.create({
      user: user._id,
      authToken: accessToken,
      ...requestInfo,
    });

    return tokens;
  }
}
