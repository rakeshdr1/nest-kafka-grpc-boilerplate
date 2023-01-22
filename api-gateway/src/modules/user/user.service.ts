import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';
import { IUserGrpcService } from './user-svc.interface';
import { AuthResponse } from './models/auth.model';
import { UserServiceClientOptions } from './user-svc.options';

@Injectable()
export class UserService {
  @Client(UserServiceClientOptions)
  private client: ClientGrpc;

  private userServiceClient: IUserGrpcService;

  onModuleInit() {
    this.userServiceClient =
      this.client.getService<IUserGrpcService>('UserService');
  }

  async signUp(signUpInput: SignUpInput): Promise<AuthResponse> {
    return firstValueFrom(this.userServiceClient.create(signUpInput));
  }

  async signIn(signInInput: SignInInput): Promise<AuthResponse> {
    return firstValueFrom(this.userServiceClient.signIn(signInInput));
  }

  async verifyToken(accessToken: string): Promise<string> {
    const { id } = await firstValueFrom(
      this.userServiceClient.verifyToken({ accessToken }),
    );
    return id;
  }
}
