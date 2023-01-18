import {
  CanActivate,
  createParamDecorator,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { parseAuthorizationHeaders } from '../utils/parse-auth-headers';
import { UserService } from '../user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly userService: UserService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    const clientRequestInfo = {
      browserId: req.header('browserId'),
      userAgent: req.header('User-Agent'),
    };

    const token = await parseAuthorizationHeaders(req.headers.authorization);

    const userId = await this.userService.verifyToken(token, clientRequestInfo);
    req.userId = userId;

    return !!userId;
  }
}

export const GetUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    return req.userId;
  },
);
