import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { SignInRequest } from './dto/sign-in.dto';
import { SignUpRequest } from './dto/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('UserService', 'create')
  async signUp(data: SignUpRequest) {
    return this.authService.signUp(data);
  }

  @GrpcMethod('UserService', 'signIn')
  async signIn(data: SignInRequest) {
    return this.authService.signIn(data);
  }

  @GrpcMethod('UserService', 'verifyToken')
  async verifyToken(accessTokenData: { accessToken: string }) {
    return this.authService.verifyAccessToken(accessTokenData.accessToken);
  }
}
