import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { GetRequest } from './decorators/user.decorator';
import { SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';
import { AuthResponse } from './models/auth.model';
import { UserService } from './user.service';

@Resolver('user')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => AuthResponse)
  async signUp(@Args('input') data: SignUpInput, @GetRequest() request) {
    return this.userService.signUp(data, request);
  }

  @Mutation(() => AuthResponse)
  async signIn(@Args('input') data: SignInInput, @GetRequest() request) {
    return this.userService.signIn(data, request);
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
