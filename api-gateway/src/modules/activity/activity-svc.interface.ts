import { Observable } from 'rxjs';

export interface IActivityGrpcService {
  findById(arg: { id: string }): Observable<unknown>;
  findAllByUser(arg: { id: string }): Observable<any>;
}
