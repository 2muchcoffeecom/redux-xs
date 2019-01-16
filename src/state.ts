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
  private sideEffects$: Subject<any[]> = new Subject();

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

    this.sideEffects$
    .pipe(
      delay(0),
      switchMap(actionsSideEffects => {
        return from(actionsSideEffects).pipe(mergeAll());
      }),
      filter((action: any) => action && action.constructor && action.constructor.type && typeof action.constructor.type === 'string')
    )
    .subscribe((action: any) => {
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
    return (state = this.params.defaults, action: AnyAction) => {
      return this.executeActionsFn(state, action);
    }
  }

  private next(nextState) {
    return (state) => {
      nextState.state = state;

      return of(nextState.state);
    }
  }

  private executeActionsFn(state, action) {
    let nextState: any = {};

    const filteredActionsFn = this.actionsData
    .filter(actionData => {
      return actionData.actionClass.type === action.type;
    })
    .map(actionData => {
      return actionData.actionFn;
    });

    const sideEffects = filteredActionsFn.map((fn: any) => {
      const sendState = nextState.state ? {...nextState.state} : state;
      return fn(this.next(nextState), sendState, action)
    });

    this.sideEffects$.next(sideEffects);

    return Object.keys(nextState).length ? nextState.state : state;
  }
}

export function State<Y>(params: IStateParams<Y>) {
  return function <T extends AnyClass>(constructor: T) {

    const decoratorClass = new StateDecorator<Y, T>(params, constructor);
    return decoratorClass.getTarget();
  };
}