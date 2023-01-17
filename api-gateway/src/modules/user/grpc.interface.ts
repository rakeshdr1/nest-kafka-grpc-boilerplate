import { Observable } from 'rxjs';

import { SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';

export interface IGrpcService {
  verifyToken(token: { accessToken: string }): Observable<{ id: string }>;

  signIn(
    data: SignInInput,
  ): Observable<{ accessToken: string; refreshToken: string }>;

  create(
    data: SignUpInput,
  ): Observable<{ accessToken: string; refreshToken: string }>;
}
