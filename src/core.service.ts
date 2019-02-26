import { RawReducer } from './interfaces/raw-reducer.interface';
import { middlewareRx } from './middleware';
import { createStoreType } from './types/create-store.type';
import { dispatchType } from './types/dispatch.type';
import { ReplaySubject } from 'rxjs';
import { applyMiddleware, combineReducers, compose, createStore, Store } from 'redux';

declare var window: any;

class CoreService {
  public store: any;
  public rawReducers: RawReducer[] = [];
  private static instance: CoreService;

  state$: ReplaySubject<any> = new ReplaySubject(1);

  constructor() {
    if (!CoreService.instance) {
      CoreService.instance = this;
    }

    return CoreService.instance;
  }

  // TODO added RootState typing
  createStore: createStoreType = ({
    reducers,
    states,
    middleware = [],
    devtools = false,
  }) => {

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

    this.getState$(this.store);

    return this.store;
  };

  getStore() {
    return this.store;
  }

  getState() {
    return this.store.getState();
  }

  dispatch: dispatchType = (action) => {
    this.store.dispatch(action);
  };

  addRawReducer(params: RawReducer){
    this.rawReducers = [...this.rawReducers, params ];
  }

  getRawReducer(stateClass): RawReducer | undefined {
    return this.rawReducers.find(rawReducer => rawReducer.stateClass === stateClass)
  }

  private getState$(store) {
    this.state$.next(store.getState());
    this.store.subscribe(() => {
      this.state$.next(store.getState());
    });
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

      rawReducer.parent = parents.pop();
      return rawReducer;
    });
  }

  private createReducers(rawReducers: RawReducer[]){
    function createReducerWithChildren(rawReducer: RawReducer, rawReducers: RawReducer[]) {
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