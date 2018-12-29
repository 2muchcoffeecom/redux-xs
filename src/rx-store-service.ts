import { applyMiddleware, combineReducers, compose, createStore, Middleware } from 'redux';
import { ReplaySubject } from 'rxjs';


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
    states: any,
    middleware: Middleware[],
    devtools: boolean

  }) {
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

}

export const rxStore = new RxStore();