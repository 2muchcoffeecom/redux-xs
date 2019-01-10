import { State, Action, ActionContext } from 'redux-xs';
import { IncrementCount, IncrementCount2 } from './test-actions';
import { SubstateState } from './substate/substate-state';
import { of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

interface TestStateModel {
  count: number,
  qqq: string
}

@State<TestStateModel>({
  name: 'test',
  defaults: {
    count: 3,
    qqq: 'qwe',
  },
  // children: [SubstateState]
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

  @Action(IncrementCount)
  increment(ctx: ActionContext<TestStateModel>, { payload }: IncrementCount) {
    const state = ctx.getState();

    // ctx.setState({
    //   ...state,
    //   count: state.count + 1
    // })

    return of(1)
    .pipe(
      delay(3000),
      tap(() => {
        ctx.setState({
          ...state,
          count: state.count + 1
        })
      })
    )
  }

  @Action(IncrementCount2)
  increment2(ctx: any) {
    const state = ctx.getState();
    // console.log(4444, state);
    ctx.setState('new state 2')
  }

}