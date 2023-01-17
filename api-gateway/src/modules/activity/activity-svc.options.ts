import { ClientOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

export const ActivityServiceClientOptions: ClientOptions = {
  transport: Transport.GRPC,
  options: {
    url: `${process.env.ACTIVITY_SVC_URL}`,
    package: 'activity',
    protoPath: join(__dirname, '../../_proto/activity.proto'),
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
};
