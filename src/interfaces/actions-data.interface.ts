import { Observable } from 'rxjs';
import { StateContext } from './state-context.interface';

export interface IActionsData {
  actionClass: AnyAction
  actionFn: <Y>(ctx: StateContext<Y>, action: AnyAction) => Observable<any>
}
