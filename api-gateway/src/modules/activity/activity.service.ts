import { Inject, Injectable } from '@nestjs/common';
import { Client, ClientGrpc, ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

import { CONSTANTS } from '@shared/constants';
import { IActivityGrpcService } from './activity-svc.interface';
import { ActivityServiceClientOptions } from './activity-svc.options';
import { CreateActivityInput, UpdateActivityInput } from './dto/activity.dto';
import {
  ActivityCreated,
  ActivityDeleted,
  ActivityUpdated,
} from '@shared/http/message';

@Injectable()
export class ActivityService {
  private activityGrpcService: IActivityGrpcService;

  @Client(ActivityServiceClientOptions)
  private readonly client: ClientGrpc;

  constructor(
    @Inject('ACTIVITY_SERVICE')
    private readonly activityService: ClientKafka,
  ) {}

  onModuleInit() {
    this.activityGrpcService =
      this.client.getService<IActivityGrpcService>('ActivityController');
  }

  async findAllByUser(userId: string) {
    return firstValueFrom(
      this.activityGrpcService.findAllByUser({ id: userId }),
    );
  }

  async create(createActivityInput: CreateActivityInput) {
    this.activityService.emit(
      CONSTANTS.KAFKA_TOPICS.ACTIVITY.CREATE,
      JSON.stringify(createActivityInput),
    );

    return { success: true, message: ActivityCreated };
  }

  async update(updateActivityInput: UpdateActivityInput) {
    this.activityService.emit(
      CONSTANTS.KAFKA_TOPICS.ACTIVITY.UPDATE,
      JSON.stringify(updateActivityInput),
    );

    return { success: true, message: ActivityUpdated };
  }

  async remove(id: string) {
    this.activityService.emit(CONSTANTS.KAFKA_TOPICS.ACTIVITY.REMOVE, id);

    return { success: true, message: ActivityDeleted };
  }
}
