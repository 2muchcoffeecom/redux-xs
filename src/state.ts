interface IStateParams {
  name: string;
  defaults: {};
}

export function State<Y>(params: IStateParams) {
  return function <T extends {new(...args:any[]):{}}>(constructor:T) {
    return constructor;
  };
}