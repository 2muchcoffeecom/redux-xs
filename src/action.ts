export function Action(actionsClass: AnyAction | AnyAction[]) {
  return function <T>(target: T, propertyKey: string, descriptor: PropertyDescriptor) {
    Reflect.defineMetadata(`actions:params:${propertyKey}`, {
      actionsClass: Array.isArray(actionsClass)? actionsClass: [actionsClass],
      actionFn: descriptor.value,
    }, target);
  }
}