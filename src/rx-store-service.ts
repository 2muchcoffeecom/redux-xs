import { applyMiddleware, combineReducers, compose, createStore, Middleware } from 'redux';
import { ReplaySubject, zip } from 'rxjs';
import { ActionContext } from './ActionContext';
import { zipAll } from 'rxjs/operators';


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
    reducers: any,
    states: any[],
    middleware: Middleware[],
    devtools: boolean

  }) {

    // zip(...this.getStateDispatch(states))
    // .subscribe(res => {
    //   console.log(34343434, res);
    // });

    this.getStateDispatch(states)[0]
    .subscribe(res => {
      console.log(34343434, res);
    });

    this.getStateDispatch(states)[1]
    .subscribe(res => {
      console.log(34343434, res);
    });

    const composeEnhancers =
      typeof window === 'object' &&
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

    const enhancer = composeEnhancers(
      applyMiddleware(...middleware),
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