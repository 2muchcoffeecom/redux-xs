class RxStore {
  private static instance: RxStore;

  private store: any;

  constructor(){
    if(! RxStore.instance){
      RxStore.instance = this;
    }

    return RxStore.instance;
  }

  setStore(store: any){
    this.store = store;
  }

  getStore(){
    return this.store;
  }


}

export const rxStore = new RxStore();