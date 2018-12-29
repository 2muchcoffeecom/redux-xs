import { State, Action, ActionContext } from 'redux-xs';
import { Increment2Count, Increment2Count2 } from './test2-actions';

interface Test2StateModel {
  aaa: number,
}

@State<Test2StateModel>({
  name: 'test2',
  defaults: {
    aaa: 11,
  },
  // children: [SubstateState]
})
export class TestState2 {

  // @Action(IncrementCount)
  // feedAnimals(ctx: StateContext<TestStateModel>) {
  //   const state = ctx.getState();
  //   ctx.setState({
  //     ...state,
  //     feed: !state.feed
  //   });
  // }

  @Action(Increment2Count)
  increment(ctx: ActionContext<Test2StateModel>, { payload }: Increment2Count) {
    const state = ctx.getState();

    ctx.setState({
      ...state,
      aaa: state.aaa + 1
    })
  }

  @Action(Increment2Count2)
  increment2(ctx: any) {
    const state = ctx.getState();
    // console.log(4444, state);
    ctx.setState('new state 2')
  }

}