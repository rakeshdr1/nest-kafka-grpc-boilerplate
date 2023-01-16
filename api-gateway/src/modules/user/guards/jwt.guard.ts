import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Request } from 'express';

import { parseAuthorizationHeaders } from '../utils/parse-auth-headers';

import { UserService } from '../user.service';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = await parseAuthorizationHeaders(
      request.headers.authorization,
    );

    const isValid = await this.userService.verifyToken(token);

    return !!isValid;
  }
}
