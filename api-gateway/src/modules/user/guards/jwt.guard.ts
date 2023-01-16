import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

import { Request } from 'express';

import { parseAuthorizationHeaders } from '../utils/parse-auth-headers';

import { UserService } from '../user.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const token = await parseAuthorizationHeaders(req.headers.authorization);

    const isValid = await this.userService.verifyToken(token);

    return !!isValid;
  }
}
