import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

import { ParseTokenPipe } from '../pipes/parse-token.pipe';

const GetToken = createParamDecorator((_, context: ExecutionContext) => {
  const ctx = GqlExecutionContext.create(context);
  const { req } = ctx.getContext();
  return req.headers.authorization;
});

export const User = () => GetToken(ParseTokenPipe);
