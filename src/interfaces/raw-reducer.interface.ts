import { Reducer } from 'redux';
import { IStateParams } from './state-params.interface';

export interface IRawReducer {
  name: string;
  params: IStateParams;
  stateClass: AnyClass;
  createReducer: (children?) => Reducer;
  isChild?: boolean;
  parent?: AnyClass;
}
