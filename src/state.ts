import { rxStore } from './rx-store-service';
import { filter, map, withLatestFrom } from 'rxjs/operators';
import { of } from 'rxjs';
import { ActionContext } from './ActionContext';

interface IStateParams <Y>{
  name: string;
  defaults: Y;
  children?: any[]
}

export function State<Y>(params: IStateParams<Y>) {
  return function <T extends {new(...args:any[]):{}}>(constructor:T) {

    const actionsData = getActionsData<T>(params, constructor);

    const dispatch$ = rxStore.dispatch$
    .pipe(
      withLatestFrom(of(actionsData)),
      map(([actionInstance, actionsData]) => {
        debugger;
        const actionData = actionsData.find((data: any) => actionInstance instanceof data.actionClass);
        return {
          actionInstance,
          actionData,
        };
      }),
    );

    dispatch$
    .pipe(
      filter((data: any) => data.actionData)
    )
    .subscribe((data: any) => {
      data.actionData.actionFn(data.actionData.ctx, data.actionInstance);

      rxStore.store.dispatch(data.actionInstance)
    });


    dispatch$
    .pipe(
      filter((data: any) => !data.actionData)
    )
    .subscribe((data: any) => {
      console.log(constructor)
      rxStore.store.dispatch(data.actionInstance)
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