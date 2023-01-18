import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { ClientRequestInfo, SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('UserService', 'create')
  async signUp(data: {
    signUpInput: SignUpInput;
    requestInfo: ClientRequestInfo;
  }) {
    const { signUpInput, requestInfo } = data;
    return this.authService.signUp(signUpInput, requestInfo);
  }

  @GrpcMethod('UserService', 'signIn')
  async signIn(data: {
    signInInput: SignInInput;
    requestInfo: ClientRequestInfo;
  }) {
    const { signInInput, requestInfo } = data;
    return this.authService.signIn(signInInput, requestInfo);
  }

  @GrpcMethod('UserService', 'verifyToken')
  async verifyToken(data: {
    accessToken: string;
    requestInfo: ClientRequestInfo;
  }) {
    const { accessToken, requestInfo } = data;
    return this.authService.verifyAccessToken(accessToken, requestInfo);
  }
}
