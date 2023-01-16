import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

import { parseAuthorizationHeaders } from '../utils/parse-auth-headers';

import { UserService } from '../user.service';

@Injectable()
export class ParseTokenPipe implements PipeTransform {
  constructor(private readonly userService: UserService) {}

  async transform(value: string, metadata: ArgumentMetadata) {
    const token = await parseAuthorizationHeaders(value);

    const id = await this.userService.verifyToken(token);

    return id;
  }
}
