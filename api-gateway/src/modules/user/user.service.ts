import { Injectable } from '@nestjs/common';
import { Client, ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { SignInInput } from './dto/sign-in.dto';
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

  async signUp(data: SignUpInput): Promise<AuthResponse> {
    const tokens = await firstValueFrom(this.userServiceClient.create(data));

    return tokens;
  }

  async signIn(data: SignInInput): Promise<AuthResponse> {
    const tokens = await firstValueFrom(this.userServiceClient.signIn(data));

    return tokens;
  }

  async verifyToken(accessToken: string): Promise<string> {
    const { id } = await firstValueFrom(
      this.userServiceClient.verifyToken({ accessToken }),
    );
    return id;
  }
}
