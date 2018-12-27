import { State } from 'redux-xs';
import { IncrementCount } from './test-actions';

interface TestStateModel {
  count: number
}

@State<TestStateModel>({
  name: 'test',
  defaults: {
    count: 0,
  }
})
export class TestState {

  // @Action(IncrementCount)
  // feedAnimals(ctx: StateContext<TestStateModel>) {
  //   const state = ctx.getState();
  //   ctx.setState({
  //     ...state,
  //     feed: !state.feed
  //   });
  // }

  // @Action(IncrementCount)
  // feedAnimals() {
  //
  // }

}