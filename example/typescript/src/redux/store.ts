import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { ApplicationState } from './application/application-state';
import { applicationReducer } from './application/application-reducer';
import { rxStore } from 'redux-xs';


declare var window: any;

export interface RootState {
  application: ApplicationState;
}

const rootReducer = combineReducers({
  application: applicationReducer,
});

const logger = (store: any) => {
  return (next: any) => {
    return function (action: any) {
      console.group(action.type)
      console.info('dispatching', action)
      let result = next(action)
      console.log('next state', store.getState())
      console.groupEnd()
      return result
    };
  };
};

const customMiddleWare = (store: any) => (next: any) => (action: any) => {
  next({ ...action });
};

const middleware = [
  customMiddleWare,
  logger
];

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(...middleware),
);

const store = createStore(rootReducer, enhancer);

export default store;
