import { State, Action, ActionContext, NewState } from 'redux-xs';
import { IncrementCount, IncrementCount2 } from '../test-actions';
import { Substate2State } from './substate2/substate2-state';

interface SubstateStateModel {
  count: number
}

@State<SubstateStateModel>({
  name: 'substate',
  defaults: {
    count: 1
  },
  children: [Substate2State]
})
export class SubstateState {
  @Action(IncrementCount)
  feedAnimals2(next: NewState<any>, state: any, action: IncrementCount2) {
    return next({
      ...state,
      count: state.count + action.payload,
    })
  }

  @Action(IncrementCount)
  feedAnimals3(next: NewState<SubstateStateModel>, state: SubstateStateModel, action: IncrementCount2) {
    return next({
      ...state,
      count: state.count + action.payload
    })
  }
}