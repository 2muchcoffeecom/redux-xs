import { applyMiddleware, combineReducers, compose, createStore, Middleware, Reducer } from 'redux';
import { middlewareRx } from './middleware';
import { IMetaReducer } from './interfaces/meta-reducer.interface';


declare var window: any;

class RxStore {
  public store: any;
  public metaReducers: IMetaReducer[] = [];
  private static instance: RxStore;

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

    this.metaReducers = this.addedParentField(this.metaReducers);
    const reducersWithChildren = {...this.createReducers(this.metaReducers), ...reducers};
    this.store = createStore(combineReducers(reducersWithChildren), enhancer);

    return this.store;
  }

  getStore() {
    return this.store;
  }

  dispatch(action: AnyAction){
    this.store.dispatch(action);
  }

  addReducer(params: IMetaReducer){
    this.metaReducers = [...this.metaReducers, params ];
  }

  private addedParentField(metaReducers){
    return metaReducers.map((metaReducer) => {

      const parents = metaReducers
      .filter(filteringMetaReducer => {
        return filteringMetaReducer.params.children && filteringMetaReducer.params.children.indexOf(metaReducer.stateClass) >= 0;
      })
      .map(filteredMetaReducer => filteredMetaReducer);

      if(parents.length > 1){
        throw new Error(`Multiple use of the ${metaReducer.stateClass.name} class in the field children`);
      }

      metaReducer.parents = parents.pop();
      metaReducer.isChild = !!metaReducer.parents;
      return metaReducer;
    });
  }

  private createReducers(metaReducers: IMetaReducer[]){
    function createReducerWithChildren(metaReducer: IMetaReducer, metaReducers: IMetaReducer[]) {
      if(metaReducer.params.children){
        return metaReducers
        .filter(filteringMetaReducer => {
          if(!metaReducer.params.children){
            return false
          }
          return metaReducer.params.children.indexOf(filteringMetaReducer.stateClass) >= 0;
        })
        .map(filteredMetaReducer => {
          return {
            name: filteredMetaReducer.name,
            reducer: filteredMetaReducer.createReducer(createReducerWithChildren(filteredMetaReducer, metaReducers))
          }
        });
      }
      return [];
    }

    return metaReducers.reduce((acc, metaReducer) => {
      if(metaReducer.isChild){
        return acc;
      }

      const reducerChildren = createReducerWithChildren(metaReducer, metaReducers);
      return {
        ...acc,
        [metaReducer.name]: metaReducer.createReducer(reducerChildren)
      }
    }, {})
  }
}


export const rxStore = new RxStore();