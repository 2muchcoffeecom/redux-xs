import { Store } from 'redux';
import { coreService } from './core.service';
import { createStoreType } from './types/create-store.type';
import { dispatchType } from './types/dispatch.type';




class XsStore {
  private static instance: XsStore;

  createStore: createStoreType = coreService.createStore.bind(coreService);
  dispatch: dispatchType = coreService.dispatch.bind(coreService);

  getStore(): Store {
    return coreService.store;
  }

  constructor() {
    if (!XsStore.instance) {
      XsStore.instance = this;
    }

    return XsStore.instance;
  }
}

export const xsStore = new XsStore();