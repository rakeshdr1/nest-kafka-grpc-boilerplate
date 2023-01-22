import { Observable } from 'rxjs';

import { SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';
import { AuthResponse } from './models/auth.model';

export interface IUserGrpcService {
  verifyToken(arg: { accessToken: string }): Observable<{ id: string }>;

  signIn(arg: SignInInput): Observable<AuthResponse>;

  create(arg: SignUpInput): Observable<AuthResponse>;
}
