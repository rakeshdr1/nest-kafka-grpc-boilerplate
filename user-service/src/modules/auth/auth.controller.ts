import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';

import { SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod('UserService', 'create')
  async signUp(signUpInput: SignUpInput) {
    return this.authService.signUp(signUpInput);
  }

  @GrpcMethod('UserService', 'signIn')
  async signIn(signInInput: SignInInput) {
    return this.authService.signIn(signInInput);
  }

  @GrpcMethod('UserService', 'verifyToken')
  async verifyToken(accessTokenData: { accessToken: string }) {
    return this.authService.verifyAccessToken(accessTokenData.accessToken);
  }
}
