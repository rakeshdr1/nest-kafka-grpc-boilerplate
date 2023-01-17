import { config } from 'dotenv';
config();
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

import { ExceptionFilter } from '@shared/filters/exception.filters';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const micro1 = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.GRPC,
    options: {
      url: configService.get('ACTIVITY_SVC_URL'),
      package: 'activity',
      protoPath: join(__dirname, './_proto/activity.proto'),
      loader: {
        enums: String,
        objects: true,
        arrays: true,
        keepCase: true,
      },
      maxReceiveMessageLength:
        Number(process.env.GRPC_MAX_MESSAGE_SIZE_BYTES) || 21000000,
      maxSendMessageLength:
        Number(process.env.GRPC_MAX_MESSAGE_SIZE_BYTES) || 21000000,
    },
  });

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: [configService.get('KAFKA_BROKER_URL')],
      },
      consumer: {
        groupId: 'activity-consumer',
      },
    },
  });
  app.useGlobalFilters(new ExceptionFilter());

  await app.startAllMicroservices();
  await micro1.listen();
}
bootstrap();
