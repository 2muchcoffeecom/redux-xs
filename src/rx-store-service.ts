import { applyMiddleware, compose, createStore, Middleware, Reducer } from 'redux';


declare var window: any;


class RxStore {
  private static instance: RxStore;

  private store: any;

  constructor() {
    if (!RxStore.instance) {
      RxStore.instance = this;
    }

    return RxStore.instance;
  }

  createStore({
    reducer,
    states,
    middleware = [],
    devtools = false,
  }: {
    reducer: Reducer,
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

    this.store = createStore(reducer, enhancer);

    return this.store;
  }

  getStore() {
    return this.store;
  }

  dispatch(action: {type: string}){
    this.store.dispatch(action);
  }

}

export const rxStore = new RxStore();