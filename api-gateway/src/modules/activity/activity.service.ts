import { HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Client, ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { CONSTANTS } from '@shared/constants';
import { CreateActivityRequest } from '@shared/dto/activity/create-activity.dto';
import { UpdateActivityRequest } from '@shared/dto/activity/update-activity.dto';

import { IGrpcService } from './grpc.interface';
import { ActivityServiceClientOptions } from './activity-svc.options';

@Injectable()
export class ActivityService {
  private activityGrpcService: IGrpcService;

  @Client(ActivityServiceClientOptions)
  private readonly client: ClientGrpc;

  constructor(
    @Inject('ACTIVITY_SERVICE')
    private readonly activityService: ClientKafka,
  ) {}

  onModuleInit() {
    this.activityGrpcService =
      this.client.getService<IGrpcService>('ActivityController');
  }

  async findAllByUser(userId: string) {
    return firstValueFrom(
      this.activityGrpcService.findAllByUser({ id: userId }),
    );
  }

  async create(data: CreateActivityRequest) {
    this.activityService.emit(
      CONSTANTS.KAFKA_TOPICS.ACTIVITY.CREATE,
      JSON.stringify(data),
    );

    return { success: true, statusCode: HttpStatus.OK };
  }

  async update(data: UpdateActivityRequest) {
    await firstValueFrom(this.activityGrpcService.findById({ id: data.id }));

    this.activityService.emit(
      CONSTANTS.KAFKA_TOPICS.ACTIVITY.UPDATE,
      JSON.stringify(data),
    );

    return { success: true, statusCode: HttpStatus.OK };
  }

  async remove(id: string) {
    await firstValueFrom(this.activityGrpcService.findById({ id }));

    this.activityService.emit(CONSTANTS.KAFKA_TOPICS.ACTIVITY.REMOVE, id);

    return { success: true, statusCode: HttpStatus.OK };
  }
}
