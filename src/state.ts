import { rxStore } from './rx-store-service';
import { delay, filter, map, mapTo, mergeAll, switchMap, withLatestFrom } from 'rxjs/operators';
import { from, isObservable, Observable, of, Subject } from 'rxjs';
import { ActionContext } from './ActionContext';
import { IActionsData } from './interfaces/actions-data.interface';
import { IReducerParams } from './interfaces/reducer-params.interface';
import { IStateParams } from './interfaces/state-params.interface';
import { IncrementCount } from '../example/typescript/src/redux/test/test-actions';
import { instanceOf } from 'prop-types';
import { type } from 'os';


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
    this.actionsData = this.getActionsData<T>(this.target);

    const actionsSideEffect$ = rxStore.dispatch$
    .pipe(
      withLatestFrom(of(this.actionsData)),
      map(([actionInstance, actionsData]) => {
        const filteredActionsData = actionsData.filter((data: IActionsData) => actionInstance instanceof data.actionClass);

        const next = (newState) => {
          this.newState = {...newState};
          return of(this.newState);
        };

        this.newState = rxStore.store.getState()[this.params.name];

        return filteredActionsData.map((actionData) => {
          return actionData.actionFn<Y>(next, this.newState, actionInstance);
        });
      }),
      delay(0),
    );

    actionsSideEffect$
    .pipe(
      switchMap(actionsSideEffects => {
        return from(actionsSideEffects).pipe(mergeAll());
      }),
      filter(action => action.type && typeof action.type === 'string')
    )
    .subscribe(action => {
      rxStore.dispatch(action);
    })
  }

  private getActionsData<T extends AnyClass>(target: T): IActionsData[] {
    const metadataKeys: string[] = Reflect.getMetadataKeys(target.prototype);
    return metadataKeys
    .map((key: string) => {
      return Reflect.getMetadata(key, target.prototype);
    });
  }

  private createReducers() {
    return (state = this.params.defaults) => {
      if(this.newState && this.newState !== state){
        return this.newState;
      }
      return state;
    }
  }
}

export function State<Y>(params: IStateParams<Y>) {
  return function <T extends AnyClass>(constructor: T) {

    const decoratorClass = new StateDecorator<Y, T>(params, constructor);
    return decoratorClass.getTarget();
  };
}