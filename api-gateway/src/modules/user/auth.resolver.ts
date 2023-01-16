import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';
import { AuthResponse } from './models/auth.model';
import { UserService } from './user.service';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => AuthResponse)
  async signUp(@Args('input') data: SignUpInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.userService.signUp(data);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Mutation(() => AuthResponse)
  async signIn(@Args('input') data: SignInInput) {
    data.email = data.email.toLowerCase();
    const { accessToken, refreshToken } = await this.userService.signIn(data);
    return {
      accessToken,
      refreshToken,
    };
  }

  @Query(() => String)
  sayHello(): string {
    return 'Hello World!';
  }
}
