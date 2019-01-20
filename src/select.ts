import { ReplaySubject } from 'rxjs';
import {
  filter,
  map,
  pluck,
  scan,
} from 'rxjs/operators';
import {
  handlerSelectType,
  pathSelectType,
  selectParamsType,
  stateSelectType
} from './interfaces/select-params.interface';
import { coreService } from './core.service';

class SelectDecorator<T> {

  private state$ = new ReplaySubject();

  constructor(target: T, propertyKey: string, params: pathSelectType );
  constructor(target: T, propertyKey: string, params: handlerSelectType );
  constructor(target: T, propertyKey: string, params: stateSelectType );
  constructor(
    private target: T,
    private propertyKey: string,
    private params: selectParamsType,
  ) {
    Reflect.defineMetadata(`select:state:${propertyKey}`, this.state$, target);

    this.onInit();
  }

  getDescriptor() {
    return Object.defineProperty(this.target, this.propertyKey, {
      configurable: true
    });
  }

  private onInit() {

    coreService.state$
    .pipe(
      map(state => this.getCurrentState(state)),
      scan((acc, next) => {
        const previous = acc.pop()
        return [previous, next]
      }, []),
      filter(([previous, next]) => {
        return previous !== next
      }),
      pluck('1'),
    )
    .subscribe((state) => {
      Object.defineProperty(this.target, this.propertyKey, {
        value: state,
        enumerable: true,
        configurable: true
      });

      this.state$.next({
        propertyKey: this.propertyKey,
        state
      })
    });
  }

  getCurrentState(state){
    const rawReducer = coreService.getRawReducer(this.params);

    if(rawReducer){
      return rawReducer.path.reduce((acc, name) => {
        return acc[name]
      }, state);
    }

    if(this.params instanceof Function && !rawReducer){
      return this.params(coreService.getState());
    }

    return state;
  }
}


export function Select(params: handlerSelectType);
export function Select(params: pathSelectType);
export function Select(params: stateSelectType);
export function Select(params: selectParamsType) {
  return function <T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) {
    const decoratorClass = new SelectDecorator<T>(target, propertyKey, params);
    return decoratorClass.getDescriptor();
  };
}