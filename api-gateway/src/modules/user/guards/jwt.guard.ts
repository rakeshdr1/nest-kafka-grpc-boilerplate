import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { parseAuthorizationHeaders } from '../utils/parse-auth-headers';
import { UserService } from '../user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const token = await parseAuthorizationHeaders(req.headers.authorization);

    const userId = await this.userService.verifyToken(token);

    req.userId = userId;

    return !!userId;
  }
}
