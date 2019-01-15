export function Action(actionClass: AnyAction) {
  return function <T>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(`action:params:${propertyKey}`, {
      actionClass,
      actionFn: descriptor.value,
    }, target);
  }
}