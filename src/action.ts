export function Action(actionClass: any) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(`action:params:${propertyKey}`, {
      actionClass,
      actionFn: descriptor.value,
    }, target);
  }
}