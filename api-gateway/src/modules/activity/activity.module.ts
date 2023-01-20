import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

import { AuthModule } from '../user/user.module';
import { ActivityResolver } from './activity.resolver';
import { ActivityService } from './activity.service';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'ACTIVITY_KAFKA_SERVICE',
        imports: [ConfigModule],
        useFactory: async (configService: ConfigService) => ({
          transport: Transport.KAFKA,
          options: {
            client: {
              clientId: 'activity-service',
              brokers: [configService.get('KAFKA_BROKER_URL')],
            },
            consumer: {
              groupId: 'activity-consumer',
            },
          },
        }),
        inject: [ConfigService],
      },
    ]),
    AuthModule,
  ],
  controllers: [],
  providers: [ActivityResolver, ActivityService],
})
export class ActivityModule {}
