import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { SignInRequest } from '@shared/dto/auth/sign-in.dto';
import { SignUpRequest } from '@shared/dto/auth/sign-up.dto';
import { TokensResponse } from '@shared/dto/auth/token-response.dto';
import { IGrpcService } from './grpc.interface';
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

  async signUp(data: SignUpRequest): Promise<TokensResponse> {
    const tokens = await firstValueFrom(this.userServiceClient.create(data));

    return tokens;
  }

  async signIn(data: SignInRequest): Promise<TokensResponse> {
    const tokens = await firstValueFrom(this.userServiceClient.signIn(data));

    return tokens;
  }

  async verifyToken(accessToken: string): Promise<string> {
    const data = await firstValueFrom(
      this.userServiceClient.verifyToken({ accessToken }),
    );
    return data.id;
  }
}
