import { Observable } from 'rxjs';

export type NewState<T = any> = (state?: T) => Observable<any>;