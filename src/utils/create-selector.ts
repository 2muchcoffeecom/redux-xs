import * as reselect from 'reselect'
import { getReducerPath } from './get-reducer-path';

export function createSelector(fnHandler: (state: any) => any);
export function createSelector(stateClass: new (...args: any[]) => any);
export function createSelector(stateClasses: (new (...args: any[]) => any)[], fnHandler: (...args: any[]) => any );
export function createSelector(...params) {

  let selectors: reselect.Selector<any, any>[] = [];
  let combiner = (state) => state;

  if(params.length === 1) {

    const [fnOrState] = params;
    const reducerPath = getReducerPath(fnOrState);

    if(reducerPath.length){
      const selector: any = state => reducerPath.reduce((acc, name) => {
        return acc[name]
      }, state);
      selectors.push(selector);
    } else {
      selectors.push(fnOrState)
    }
  }

  if(params.length === 2) {
    const [stateClassesOrSelectors, fnHandler] = params;
    combiner = fnHandler;

    selectors = stateClassesOrSelectors
    .map((stateClass: any, index: number) => {
      const reducerPath = getReducerPath(stateClass);

      if(reducerPath.length){
        return (state: any) => {
          return reducerPath.reduce((acc, name) => {
            return acc[name]
          }, state);
        };
      } else {
        return stateClassesOrSelectors[index]
      }
    });
  }

  return reselect.createSelector(selectors, combiner)
}

