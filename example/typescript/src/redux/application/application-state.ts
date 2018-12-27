import { State } from 'redux-xs';

export interface ApplicationState {
  count: number;
}

export const applicationInitialState: ApplicationState = {
  count: 0,
};