import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';
import { AuthResponse } from './models/auth.model';
import { UserService } from './user.service';

@Resolver('user')
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => AuthResponse)
  async signUp(@Args('input') signUpInput: SignUpInput) {
    return this.userService.signUp(signUpInput);
  }

  @Mutation(() => AuthResponse)
  async signIn(@Args('input') signInInput: SignInInput) {
    return this.userService.signIn(signInInput);
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
