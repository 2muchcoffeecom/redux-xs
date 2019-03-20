import { from, isObservable, of, ReplaySubject } from 'rxjs';

import { coreService } from './core.service';
import {
  delay,
  filter,
  map,
  mergeAll,
  switchMap
} from 'rxjs/operators';
import { IActionsData } from './interfaces/actions-data.interface';
import { IStateParams } from './interfaces/state-params.interface';
import { mergeDeep } from './utils/merge-deep';
import { RawReducer } from './interfaces/raw-reducer.interface';


class StateDecorator<Y, T extends AnyClass> {
  private actionsData: IActionsData[];
  private sideEffects$: ReplaySubject<any[]> = new ReplaySubject();

  constructor(
    private params: IStateParams<Y>,
    private target: T
  ) {
    this.onInit();

    coreService.addRawReducer(
      new RawReducer({
        name: this.params.name,
        params: this.params,
        stateClass: this.target,
        createReducer: this.createReducer.bind(this)
      })
    );
  }

  getTarget() {
    return this.target;
  }

  private onInit() {
    this.actionsData = this.getActionsData<T>(this.target);
    this.sideEffects$
    .pipe(
      delay(4000),
      switchMap((actionsSideEffects) => from(actionsSideEffects)),
      map((actionsSideEffects) => {
        if(isObservable(actionsSideEffects)){
          return actionsSideEffects
        }
        return from(actionsSideEffects)
      }),
      mergeAll(),
      switchMap(actions => Array.isArray(actions) ? from(actions) : of(actions)),
      filter((action: any) => {
        return action && ((action.constructor && action.constructor.type && typeof action.constructor.type === 'string') || (action.type && typeof action.type === 'string'));
      }),
    )
    .subscribe((action: AnyAction) => {
      coreService.dispatch(action);
    })
  }

  private getActionsData<T extends AnyClass>(target: T): IActionsData[] {
    const metadataKeys: string[] = Reflect.getMetadataKeys(target.prototype) || [];
    return metadataKeys.map((key: string) => Reflect.getMetadata(key, target.prototype));
  }

  private createReducer(children?: any[]) {
    return (state = this.params.defaults, action: AnyAction) => {
      let nextState = this.executeActionsFn(state, action);
      if(children){

        const childrenStates = children.reduce((acc, children) => {
          return {
            ...acc,
            [children.name]: {...children.reducer(nextState[children.name], action)}
          };
        }, {});

        nextState = {...nextState, ...childrenStates}
      }

      return nextState;
    }
  }

  private setState(nextState, sendingState: T) {
    return (state?: T) => {
      nextState.state = state || sendingState;

      return of(nextState.state);
    }
  }

  private patchState(nextState, sendingState: any) {
    return (state?: any) => {
      nextState.state = {
        ...sendingState,
        ...state
      } as T;

      return of(nextState.state);
    }
  }

  private executeActionsFn(state, action) {
    let nextState: any = {};

    const filteredActionsFn = this.actionsData
    .filter((actionData: IActionsData) => {
      return actionData.actionsClass.map(actionsClass => actionsClass.type).indexOf(action.type) >= 0 ;
    })
    .map(actionData => {
      return actionData.actionFn;
    });

    const sideEffects = filteredActionsFn.map((fn: any) => {
      const sendingState = nextState.state ? {...nextState.state} : state;

      const ctx = {
        state: sendingState,
        setState: this.setState(nextState, sendingState),
        patchState: this.patchState(nextState, sendingState)
      };

      return fn(ctx, action)
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