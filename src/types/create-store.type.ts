import { Middleware, Reducer, Store } from 'redux';

export type createStoreType = (params: {
  states: AnyState[],
  reducers?: {[key:string]: Reducer},
  middleware?: Middleware[],
  devtools?: boolean
}) => Store