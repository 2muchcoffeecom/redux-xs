import { rxStore } from './rx-store-service';

export class ActionContext<T>{
  private newState: T;

  constructor(
    public path: string
  ){
  }

  setState(state: T){
    this.newState = state;
  }

  getState(): T {
    return rxStore.store.getState()[this.path]
  }

  getNewState(): T {
    return this.newState;
  }
}