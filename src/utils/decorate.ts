// ToDo refactor __decorate function
const __decorate = function (decorators: any, target: any, key?: any, desc?: any) {
  let argumentsLength = arguments.length;
  let targetOrDesc = argumentsLength < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc;
  let fn;


  for (let i = decorators.length - 1; i >= 0; i--) {
    if (fn = decorators[i]) {
      targetOrDesc = (argumentsLength < 3 ? fn(targetOrDesc) : argumentsLength > 3 ? fn(target, key, targetOrDesc) : fn(target, key)) || targetOrDesc;
    }
  }

  return argumentsLength > 3 && targetOrDesc && Object.defineProperty(target, key, targetOrDesc), targetOrDesc;
};

export const decorate = (target: any, params: {
  state: (...args:any[]) => any,
  actions: {
    [key:string]: (...args:any[]) => any
  }
}): any => {
  const actions = Object.keys(params.actions);
  actions.forEach((actionName) => {
    __decorate([
      params.actions[actionName]
    ], target.prototype, actionName, null);
  });

  return __decorate([params.state], target);
};