import { applyMiddleware, combineReducers, compose, createStore, Middleware, Reducer } from 'redux';
import { IRawReducer } from './interfaces/raw-reducer.interface';
import { middlewareRx } from './middleware';


declare var window: any;

class CoreService {
  public store: any;
  public rawReducers: IRawReducer[] = [];
  private static instance: CoreService;

  constructor() {
    if (!CoreService.instance) {
      CoreService.instance = this;
    }

    return CoreService.instance;
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

    this.rawReducers = this.addedParentField(this.rawReducers);
    const reducersWithChildren = {...this.createReducers(this.rawReducers), ...reducers};
    this.store = createStore(combineReducers(reducersWithChildren), enhancer);

    return this.store;
  }

  getStore() {
    return this.store;
  }

  dispatch(action: AnyAction){
    this.store.dispatch(action);
  }

  addRawReducer(params: IRawReducer){
    this.rawReducers = [...this.rawReducers, params ];
  }

  private addedParentField(rawReducers){
    return rawReducers.map((rawReducer) => {

      const parents = rawReducers
      .filter(filteringRawReducer => {
        return filteringRawReducer.params.children && filteringRawReducer.params.children.indexOf(rawReducer.stateClass) >= 0;
      })
      .map(filteredRawReducer => filteredRawReducer);

      if(parents.length > 1){
        throw new Error(`Multiple use of the ${rawReducer.stateClass.name} class in the field children`);
      }

      rawReducer.parents = parents.pop();
      rawReducer.isChild = !!rawReducer.parents;
      return rawReducer;
    });
  }

  private createReducers(rawReducers: IRawReducer[]){
    function createReducerWithChildren(rawReducer: IRawReducer, rawReducers: IRawReducer[]) {
      if(rawReducer.params.children){
        return rawReducers
        .filter(filteringRawReducer => {
          if(!rawReducer.params.children){
            return false
          }
          return rawReducer.params.children.indexOf(filteringRawReducer.stateClass) >= 0;
        })
        .map(filteredRawReducer => {
          return {
            name: filteredRawReducer.name,
            reducer: filteredRawReducer.createReducer(createReducerWithChildren(filteredRawReducer, rawReducers))
          }
        });
      }
      return [];
    }

    return rawReducers.reduce((acc, rawReducer) => {
      if(rawReducer.isChild){
        return acc;
      }

      const reducerChildren = createReducerWithChildren(rawReducer, rawReducers);
      return {
        ...acc,
        [rawReducer.name]: rawReducer.createReducer(reducerChildren)
      }
    }, {})
  }
}


export const coreService = new CoreService();