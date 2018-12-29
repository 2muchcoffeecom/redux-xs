import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { ApplicationState } from './application/application-state';
import { applicationReducer } from './application/application-reducer';
// import { rxStore } from '../../node_modules/redux-xs/dist';
import { rxStore } from 'redux-xs';

import { TestState2 } from './test2/test2-state';
import { TestState } from './test/test-state';






const logger = (store: any) => {
  return (next: any) => {
    return function (action: any) {
      console.group(action.type);
      console.info('dispatching', action);
      let result = next(action);
      console.log('next state', store.getState());
      console.groupEnd();
      return result
    };
  };
};

const customMiddleWare = (store: any) => (next: any) => (action: any) => {
  next({ ...action, type: action.constructor.type });
};

const middleware = [
  customMiddleWare,
  logger
];



export interface RootState {
  application: ApplicationState;
}

const reducers = {
  application: applicationReducer,
};


const store = rxStore.createStore({
  reducers,
  middleware,
  devtools: true,
  states: {
    TestState2,
    TestState,
  }
});

export default store;
