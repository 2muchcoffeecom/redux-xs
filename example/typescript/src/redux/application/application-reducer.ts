import { applicationInitialState, ApplicationState } from './application-state';
import { ApplicationActions, ApplicationActionTypes } from './application-actions';

export function applicationReducer(state = applicationInitialState, action: ApplicationActions): ApplicationState {

  switch (action.type) {
    case ApplicationActionTypes.INCREMENT: {
      return {
        ...state,
        count: state.count + 1
      };
    }

    default:
      return state;
  }
}