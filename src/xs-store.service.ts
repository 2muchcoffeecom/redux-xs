import { coreService } from './core.service';
import { createStoreType } from './types/create-store.type';
import { dispatchType } from './types/dispatch.type';
import {
  handlerSelectType,
  pathSelectType,
  selectParamsType,
  stateSelectType
} from './interfaces/select-params.interface';
import { Observable } from 'rxjs';
import { filter, map, pluck, publishLast, publishReplay, scan } from 'rxjs/operators';


class XsStore {
  private static instance: XsStore;

  createStore: createStoreType = coreService.createStore.bind(coreService);
  dispatch: dispatchType = coreService.dispatch.bind(coreService);

  constructor() {
    if (!XsStore.instance) {
      XsStore.instance = this;
    }

    return XsStore.instance;
  }

  // TODO not working with promises
  // TODO added reselect
  // TODO added memoized selector
  select<T = any>(params: pathSelectType ): Observable<T>;
  select<T = any>(params: handlerSelectType ): Observable<T>;
  select<T = any>(params: stateSelectType ): Observable<T>;
  select<T = any>(params: selectParamsType): Observable<T> {
    const getCurrentState = (state) => {

      const rawReducer = coreService.getRawReducer(params);

      if(rawReducer){
        return rawReducer.path.reduce((acc, name) => {
          return acc[name]
        }, state);
      }

      if(params instanceof Function && !rawReducer){
        return params(coreService.getState());
      }

      return state;
    };

    return coreService.state$
    .pipe(
      map(state => getCurrentState(state)),
      scan((acc, next) => {

        const previous = acc.pop()
        return [previous, next]
      }, []),
      filter(([previous, next]) => {
        return previous !== next
      }),
      pluck('1'),
    )
  }
}

export const xsStore = new XsStore();