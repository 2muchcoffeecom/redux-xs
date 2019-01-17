import { Observable } from 'rxjs';

export interface StateContext<T = any> {
  state: T;
  setState(val?: T): Observable<T>;
  patchState(val?: Partial<T>): Observable<T>;
}