import { User } from '../../user/schemas/user.schema';

export class TokensResponse {
  readonly user: User;

  readonly accessToken: string;

  readonly refreshToken: string;
}
