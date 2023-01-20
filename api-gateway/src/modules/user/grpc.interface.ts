import { Observable } from 'rxjs';

import { ClientRequestInfo, SignInInput } from './dto/sign-in.dto';
import { SignUpInput } from './dto/sign-up.dto';
import { AuthResponse } from './models/auth.model';

export interface IGrpcService {
  verifyToken(arg: {
    accessToken: string;
    requestInfo: ClientRequestInfo;
  }): Observable<{ id: string }>;

  signIn(arg: {
    signInInput: SignInInput;
    requestInfo: ClientRequestInfo;
  }): Observable<AuthResponse>;

  create(arg: {
    signUpInput: SignUpInput;
    requestInfo: ClientRequestInfo;
  }): Observable<AuthResponse>;
}
