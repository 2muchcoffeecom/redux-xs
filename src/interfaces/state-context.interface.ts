import { Observable } from 'rxjs';

export interface StateContext<T = any> {
  getState(): T;
  setState(val?: T): Observable<T>;
  patchState(val?: Partial<T>): Observable<T>;
}