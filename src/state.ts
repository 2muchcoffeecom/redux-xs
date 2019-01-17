import { from, of, Subject } from 'rxjs';

import { coreService } from './core.service';
import { delay, filter, mergeAll, switchMap } from 'rxjs/operators';
import { IActionsData } from './interfaces/actions-data.interface';
import { IStateParams } from './interfaces/state-params.interface';


class StateDecorator<Y, T extends AnyClass> {
  private actionsData: IActionsData[];
  private sideEffects$: Subject<any[]> = new Subject();

  constructor(
    private params: IStateParams<Y>,
    private target: T
  ) {
    this.onInit();

    coreService.addRawReducer({
      name: this.params.name,
      params: this.params,
      stateClass: this.target,
      createReducer: this.createReducer.bind(this)
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
      switchMap(actionsSideEffects => from(actionsSideEffects).pipe(mergeAll())),
      switchMap(actions => Array.isArray(actions) ? from(actions) : of(actions)),
      filter((action: any) => {
        return action && action.constructor && action.constructor.type && typeof action.constructor.type === 'string';
      })
    )
    .subscribe((action: AnyAction) => {
      coreService.dispatch(action);
    })
  }

  private getActionsData<T extends AnyClass>(target: T): IActionsData[] {
    const metadataKeys: string[] = Reflect.getMetadataKeys(target.prototype);
    return metadataKeys
    .map((key: string) => {
      return Reflect.getMetadata(key, target.prototype);
    });
  }

  private createReducer(children?: any[]) {
    return (state = this.params.defaults, action: AnyAction) => {
      const nextState = this.executeActionsFn(state, action);
      if(children){

        const childrenStates = children.reduce((acc, children) => {
          return {
            ...acc,
            [children.name]: children.reducer(nextState[children.name], action),
          };
        }, {});

        return {
          ...nextState,
          ...childrenStates,
        }
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
      const sendingState = nextState.state ? {...nextState.state} : state;

      const ctx = {
        state: sendingState,
        setState: this.setState(nextState, sendingState),
        // patchState: this.patchState(nextState, sendingState) ToDo Implement patch state
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