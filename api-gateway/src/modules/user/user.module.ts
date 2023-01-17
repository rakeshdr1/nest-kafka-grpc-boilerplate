import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthResolver } from './auth.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'AUTH-SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'auth-service',
              brokers: [configService.get('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: 'auth-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
  ],
  providers: [AuthResolver, UserService],
  exports: [UserService],
})
export class AuthModule {}
