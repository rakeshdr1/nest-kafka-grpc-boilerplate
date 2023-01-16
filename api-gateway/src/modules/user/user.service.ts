import { Inject, Injectable } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { SignInRequest } from '@shared/dto/auth/sign-in.dto';
import { SignUpRequest } from '@shared/dto/auth/sign-up.dto';
import { TokensResponse } from '@shared/dto/auth/token-response.dto';
import { IGrpcService } from './grpc.interface';

@Injectable()
export class UserService {
  @Inject('USER_GRPC_SERVICE')
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
