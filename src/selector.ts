import { selectParamsType } from './interfaces/select-params.interface';

export class SelectorDecorator<T> {

  constructor(
    private target: T,
    private propertyKey: string,
) {
    this.onInit();
  }

  onInit(){

  }
}

export function Selector(params?: selectParamsType) {
  return function <T>(target: T, propertyKey: string, descriptor?: PropertyDescriptor) {
    const decoratorClass = new SelectorDecorator<T>(target, propertyKey);
    return descriptor;
  };
}