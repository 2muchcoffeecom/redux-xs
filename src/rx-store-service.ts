import { applyMiddleware, combineReducers, compose, createStore, Middleware, Reducer } from 'redux';
import { ReplaySubject, zip } from 'rxjs';
import { ActionContext } from './ActionContext';
import { map, mergeAll, mergeMap, zipAll } from 'rxjs/operators';
import { middlewareRx } from './middleware';
// import { AnyState } from './interfaces/any-state';
// import { AnyState } from './interfaces/any-state';
// import { AnyState } from './interfaces/any-state';


declare var window: any;


class RxStore {
  private static instance: RxStore;

  public dispatch$: ReplaySubject<any> = new ReplaySubject();

  public store: any;
  public reducers: any = {};

  constructor() {
    if (!RxStore.instance) {
      RxStore.instance = this;
    }

    return RxStore.instance;
  }

  createStore({
    reducers,
    states,
    middleware = [],
    devtools = false,
  }: {
    reducers: {[key:string]: Reducer},
    states: AnyState[],
    middleware: Middleware[],
    devtools: boolean

  }) {

    const composeEnhancers =
      typeof window === 'object' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ &&
      devtools? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

    const enhancer = composeEnhancers(
      applyMiddleware(middlewareRx, ...middleware),
    );

    this.reducers = {...this.reducers, ...reducers};
    this.store = createStore(combineReducers(this.reducers), enhancer);

    return this.store;
  }

  getStore() {
    return this.store;
  }

  dispatch(action: any){
    this.dispatch$.next(action);
    this.store.dispatch(action);
  }

  addReducer(reducer: any){
    this.reducers = {...this.reducers, ...reducer};
  }

  private getStateDispatch(states: any[]) {
    return states.map((stateClass: any) => {
      return Reflect.getMetadata('action:dispatch:observable', stateClass);
    });
  }
}


export const rxStore = new RxStore();