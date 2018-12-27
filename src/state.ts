interface IStateParams <Y>{
  name: string;
  defaults: Y;
}

export function State<Y>(params: IStateParams<Y>) {
  return function <T extends {new(...args:any[]):{}}>(constructor:T) {
    return constructor;
  };
}