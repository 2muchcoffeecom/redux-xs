import { State, Action } from 'redux-xs';

interface SubstateStateModel {
  count: number
}

@State<SubstateStateModel>({
  name: 'substate',
  defaults: {
    count: 1
  }
})
export class SubstateState {
}