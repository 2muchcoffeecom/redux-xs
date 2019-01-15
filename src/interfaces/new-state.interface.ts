import { Observable } from 'rxjs';

export type NewState<T> = (state: T) => Observable<T>;