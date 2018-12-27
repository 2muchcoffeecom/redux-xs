import { Action } from 'redux';

const APPLICATION = 'Application';

export const ApplicationActionTypes = {
  INCREMENT: `[${APPLICATION}] Increment`,
};

export class IncrementAction implements Action {
  type = ApplicationActionTypes.INCREMENT;
}

export type ApplicationActions = IncrementAction;