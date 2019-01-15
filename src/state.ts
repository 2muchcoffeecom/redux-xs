import { rxStore } from './rx-store-service';
import { filter, map, mapTo, switchMap, withLatestFrom } from 'rxjs/operators';
import { isObservable, Observable, of, Subject } from 'rxjs';
import { ActionContext } from './ActionContext';
import { IActionsData } from './interfaces/actions-data.interface';
import { IReducerParams } from './interfaces/reducer-params.interface';
import { IStateParams } from './interfaces/state-params.interface';


class StateDecorator<Y, T extends AnyClass> {
  private actionsData: IActionsData[];
  private newState: Y;

  constructor(
    private params: IStateParams<Y>,
    private target: T
  ) {
    this.onInit();

    rxStore.addReducer({
      [this.params.name]: this.createReducers()
    });
  }

  getTarget() {
    return this.target;
  }

  private onInit() {
    this.actionsData = this.getActionsData<Y, T>(this.params, this.target);

    const dispatch$ = rxStore.dispatch$
    .pipe(
      withLatestFrom(of(this.actionsData)),
      map(([actionInstance, actionsData]) => {
        const actionData = actionsData.find((data: IActionsData) => actionInstance instanceof data.actionClass);
        return {
          actionInstance,
          actionData,
        };
      }),
    )
    .subscribe(
      ({actionInstance, actionData}: { actionInstance: any, actionData: IActionsData }) => {
        // console.log(actionInstance, actionData);
        const next = (newState) => {
          this.newState = {...newState};
          return of(this.newState);
        };

        const state = rxStore.store.getState()[this.params.name];
        actionData.actionFn(next, state);
      }
    )

  }

  private getActionsData<Y, T extends AnyClass>(params: IStateParams<Y>, target: T): IActionsData[] {
    const metadataKeys: string[] = Reflect.getMetadataKeys(target.prototype);
    return metadataKeys
    .map((key: string) => {
      return Reflect.getMetadata(key, target.prototype);
    });
  }

  private createReducers() {
    const reducerParams: IReducerParams[] = this.actionsData.map((actionData: IActionsData) => {
      return {
        type: actionData.actionClass.type,
      }
    });

    return this.createReducer(this.params.defaults, reducerParams)
  }

  private createReducer(defaults: Y, params: IReducerParams[]) {
    return (state = defaults, action: AnyAction) => {

      const types = params.map(({type}) => type);
      const index = types.indexOf(action.type);
      if (index >= 0) {
        console.log(123, this.newState);
        return this.newState || state; // return params[index].ctx.getNewState() || state;
      }
      return state;
    }
  }
}

export function State<Y>(params: IStateParams<Y>) {
  return function <T extends AnyClass>(constructor: T) {

    const decoratorClass = new StateDecorator<Y, T>(params, constructor);
    return decoratorClass.getTarget();

    // return constructor;

    // const dispatchAction$ = new Subject();
    // Reflect.defineMetadata(`action:dispatch:observable`, dispatchAction$, constructor);
    //
    // const actionsData = getActionsData<T>(params, constructor);
    //
    // console.log(45445, actionsData)
    //
    // const dispatch$ = rxStore.dispatch$
    // .pipe(
    //   withLatestFrom(of(actionsData)),
    //   map(([actionInstance, actionsData]) => {
    //     const actionData = actionsData.find((data: any) => actionInstance instanceof data.actionClass);
    //     return {
    //       actionInstance,
    //       actionData,
    //     };
    //   }),
    // );
    //
    // dispatch$
    // .pipe(
    //   filter((data: any) => data.actionData),
    //   switchMap((data: any) => {
    //     const stateActionResult = data.actionData.actionFn(data.actionData.ctx, data.actionInstance);
    //
    //     return stateActionResult.pipe(
    //       map((actionStream: any) => {
    //         return {
    //           ...data,
    //           actionStream
    //         }
    //       })
    //     );
    //   })
    // )
    // .subscribe((data: any) => {
    //   console.log(222, data, params)
    //   dispatchAction$.next(data);
    //   // rxStore.store.dispatch(data.actionInstance)
    // });
    //
    // rxStore.addReducer({
    //   [params.name]: createReducers(params, actionsData)
    // });
    //
    // return constructor;
  };
}

// function getActionsData<T extends {new(...args:any[]):{}}>(params: any, target: T) {
//   const metadataKeys = Reflect.getMetadataKeys(target.prototype);
//   return metadataKeys
//   .map(key => {
//     return Reflect.getMetadata(key, target.prototype);
//   })
//   .map(data => {
//     return {
//       ...data,
//       ctx: new ActionContext(params.name),
//     };
//   });
// }
//
// function createReducers(params: any, actionsData: any) {
//   const IReducerParams = actionsData.map((actionData: any) => {
//     return {
//       type: actionData.actionClass.type,
//       ctx: actionData.ctx
//     }
//   });
//   return createReducer(params.defaults, IReducerParams)
// }
//
// function createReducer(defaults: any, params: any[]){
//   return function reducer(state = defaults, action: any) {
//
//     const types = params.map(({type}) => type);
//     const index = types.indexOf(action.type);
//     if(index >= 0){
//       return params[index].ctx.getNewState() || state;
//     }
//
//     return state;
//   }
// }