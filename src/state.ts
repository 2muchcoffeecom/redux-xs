import { rxStore } from './rx-store-service';
import { filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { isObservable, of, Subject } from 'rxjs';
import { ActionContext } from './ActionContext';

interface IStateParams <Y>{
  name: string;
  defaults: Y;
  children?: any[]
}

export function State<Y>(params: IStateParams<Y>) {
  return function <T extends {new(...args:any[]):{}}>(constructor:T) {

    const dispatchAction$ = new Subject();

    Reflect.defineMetadata(`action:dispatch:observable`, dispatchAction$, constructor);

    const actionsData = getActionsData<T>(params, constructor);

    const dispatch$ = rxStore.dispatch$
    .pipe(
      withLatestFrom(of(actionsData)),
      map(([actionInstance, actionsData]) => {
        const actionData = actionsData.find((data: any) => actionInstance instanceof data.actionClass);
        return {
          actionInstance,
          actionData,
        };
      }),
    );

    dispatch$
    .pipe(
      filter((data: any) => data.actionData),
      switchMap((data: any) => {
        const stateActionResult = data.actionData.actionFn(data.actionData.ctx, data.actionInstance);

        if(isObservable(stateActionResult)){
          return stateActionResult.pipe(
            mapTo(data)
          );
        } else {
          return of(data);
        }
      })
    )
    .subscribe((data: any) => {
      console.log(222, data)
      dispatchAction$.next(data.actionInstance);
      // rxStore.store.dispatch(data.actionInstance)
    });


    dispatch$
    .pipe(
      filter((data: any) => !data.actionData)
    )
    .subscribe((data: any) => {
      // debugger;
      // console.log(333, data)
      // console.log(constructor)
      // rxStore.store.dispatch(data.actionInstance)
      dispatchAction$.next(data.actionInstance);
    });

    rxStore.addReducer({
      [params.name]: createReducers(params, actionsData)
    });

    return constructor;
  };
}

function getActionsData<T extends {new(...args:any[]):{}}>(params: any, target: T) {
  const metadataKeys = Reflect.getMetadataKeys(target.prototype);
  return metadataKeys
  .map(key => {
    return Reflect.getMetadata(key, target.prototype);
  })
  .map(data => {
    return {
      ...data,
      ctx: new ActionContext(params.name),
    };
  });
}

function createReducers(params: any, actionsData: any) {
  const reducerParams = actionsData.map((actionData: any) => {
    return {
      type: actionData.actionClass.type,
      ctx: actionData.ctx
    }
  });
  return createReducer(params.defaults, reducerParams)
}

function createReducer(defaults: any, params: any[]){
  return function reducer(state = defaults, action: any) {

    const types = params.map(({type}) => type);
    const index = types.indexOf(action.type);
    if(index >= 0){
      return params[index].ctx.getNewState() || state;
    }

    return state;
  }
}