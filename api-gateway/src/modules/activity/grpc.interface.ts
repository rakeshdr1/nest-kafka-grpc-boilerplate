import { Observable } from 'rxjs';

export interface IGrpcService {
  findById(arg0: { id: string }): Observable<unknown>;
  findAllByUser(arg0: { id: string }): Observable<any>;
}
