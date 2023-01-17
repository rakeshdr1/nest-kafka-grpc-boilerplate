import { Observable } from 'rxjs';

import { SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';
import { AuthResponse } from './models/auth.model';

export interface IGrpcService {
  verifyToken(token: { accessToken: string }): Observable<{ id: string }>;

  signIn(data: SignInInput): Observable<AuthResponse>;

  create(data: SignUpInput): Observable<AuthResponse>;
}
