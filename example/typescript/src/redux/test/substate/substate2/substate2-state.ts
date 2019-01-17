import { State, Action, ActionContext, NewState } from 'redux-xs';
import { IncrementCount, IncrementCount2 } from '../../test-actions';

interface Substate2StateModel {
  count: number
}

@State<Substate2StateModel>({
  name: 'substate2',
  defaults: {
    count: 1
  }
})
export class Substate2State {
  @Action(IncrementCount)
  feedAnimals2(next: NewState<Substate2StateModel>, state: Substate2StateModel, action: IncrementCount2) {
    return next({
      ...state,
      count: state.count + action.payload
    })
  }

  @Action(IncrementCount)
  feedAnimals3(next: NewState<Substate2StateModel>, state: Substate2StateModel, action: IncrementCount2) {
    return next({
      ...state,
      count: state.count + action.payload
    })
  }
}