import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { ClientRequestInfo, SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';
import { IGrpcService } from './grpc.interface';
import { AuthResponse } from './models/auth.model';
import { UserServiceClientOptions } from './user-svc.options';

@Injectable()
export class UserService {
  @Client(UserServiceClientOptions)
  private client: ClientGrpc;

  private userServiceClient: IGrpcService;

  onModuleInit() {
    this.userServiceClient =
      this.client.getService<IGrpcService>('UserService');
  }

  async signUp(signUpInput: SignUpInput, request): Promise<AuthResponse> {
    return firstValueFrom(
      this.userServiceClient.create({
        signUpInput,
        requestInfo: {
          browserId: request.header('browserId'),
          userAgent: request.header('User-Agent'),
        },
      }),
    );
  }

  async signIn(signInInput: SignInInput, request): Promise<AuthResponse> {
    return firstValueFrom(
      this.userServiceClient.signIn({
        signInInput,
        requestInfo: {
          browserId: request.header('browserId'),
          userAgent: request.header('User-Agent'),
        },
      }),
    );
  }

  async verifyToken(
    accessToken: string,
    requestInfo: ClientRequestInfo,
  ): Promise<string> {
    const { id } = await firstValueFrom(
      this.userServiceClient.verifyToken({ accessToken, requestInfo }),
    );
    return id;
  }
}
