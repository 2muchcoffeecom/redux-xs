import { Middleware, Reducer, Store } from 'redux';

export type createStoreType = (params: {
  reducers: {[key:string]: Reducer},
  states: AnyState[],
  middleware?: Middleware[],
  devtools: boolean
}) => Store