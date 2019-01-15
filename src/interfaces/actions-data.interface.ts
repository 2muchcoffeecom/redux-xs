import { NewState } from './new-state.interface';
import { Observable } from 'rxjs';

export interface IActionsData {
  actionClass: AnyAction
  actionFn: <Y>(next: NewState<Y>, state: Y, action: AnyAction) => Observable<any>

}
