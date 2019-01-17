import { Reducer, AnyAction } from 'redux';
import { IStateParams } from './state-params.interface';

export interface IMetaReducer {
  name: string;
  params: IStateParams;
  stateClass: AnyClass;
  createReducer: (children?) => Reducer;
  isChild?: boolean;
  parent?: AnyClass;
}
