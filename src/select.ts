import { Observable, ReplaySubject } from 'rxjs';
import {
  handlerSelectType,
  pathSelectType,
  selectParamsType,
  stateSelectType
} from './interfaces/select-params.interface';
import { xsStore } from './xs-store.service';

class SelectDecorator<T, S = any> {
  private state$ = new ReplaySubject();

  constructor(
    private target: T,
    private propertyKey: string,
    private currentState$: Observable<S>,
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
    this.currentState$
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
}


export function Select(params: handlerSelectType);
export function Select(params: pathSelectType);
export function Select(params: stateSelectType);
export function Select(params: selectParamsType) {
  return function <T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) {
    const state$ = xsStore.select(params);
    const decoratorClass = new SelectDecorator<T>(target, propertyKey, state$);
    return decoratorClass.getDescriptor();
  };
}