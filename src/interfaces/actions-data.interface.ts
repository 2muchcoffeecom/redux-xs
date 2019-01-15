import { NewState } from './new-state.interface';

export interface IActionsData {
  actionClass: AnyAction
  actionFn: <Y>(next: NewState<Y>, state: Y, action: AnyAction) => {}
}