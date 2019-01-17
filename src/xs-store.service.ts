import { coreService } from './core.service';
import { Store } from 'redux';

class XsStore {
  private static instance: XsStore;

  createStore: typeof coreService.createStore = coreService.createStore.bind(coreService);
  dispatch: typeof coreService.dispatch = coreService.dispatch.bind(coreService);

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