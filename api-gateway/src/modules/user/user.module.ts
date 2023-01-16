import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { AuthResolver } from './auth.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'USER_GRPC_SERVICE',
        transport: Transport.GRPC,
        options: {
          package: 'user',
          url: `localhost:5005`,
          protoPath: join(__dirname, '../../shared/_proto/user.proto'),
        },
      },
      {
        name: 'AUTH-SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'auth-service',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'auth-consumer',
          },
        },
      },
    ]),
  ],
  providers: [AuthResolver, UserService],
  exports: [UserService],
})
export class AuthModule {}
