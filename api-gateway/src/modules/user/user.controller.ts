import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { SignInRequest } from '@shared/dto/auth/sign-in.dto';
import { SignUpRequest } from '@shared/dto/auth/sign-up.dto';
import HttpOkResponse from '@shared/http/ok-response';

import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly authService: UserService) {}

  @Post('signUp')
  async signUp(@Body() data: SignUpRequest) {
    const { accessToken, refreshToken } = await this.authService.signUp(data);

    return new HttpOkResponse({ accessToken, refreshToken });
  }

  @Post('signIn')
  async signIn(@Body() data: SignInRequest) {
    const { accessToken, refreshToken } = await this.authService.signIn(data);

    return new HttpOkResponse({ accessToken, refreshToken });
  }
}
