import { State, Action, ActionContext, NewState } from 'redux-xs';
import { Increment2Count, Increment2Count2 } from './test2-actions';
import { IncrementCount } from '../test/test-actions';
import { of } from 'rxjs';
import { delay, map, mapTo } from 'rxjs/operators';
import { qwe } from '../test/test-state';

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

  @Action(IncrementCount)
  feedAnimals1(next: NewState<Test2StateModel>, state: Test2StateModel) {
    return next({
      ...state,
      aaa: state.aaa + 1
    })
    .pipe(
      map((res) => {
        return res.aaa
      })
    );
  }


  // @Action(IncrementCount)
  // feedAnimals3(ctx: ActionContext<any>) {
  //   return of(1)
  //   .pipe(
  //     delay(3000),
  //     qwe({
  //       pathState: () => {
  //         console.log(222)
  //         return 222;
  //       }
  //     }),
  //   )
  // }

  // // @Action(IncrementCount)
  // // feedAnimals(ctx: StateContext<TestStateModel>) {
  // //   const state = ctx.getState();
  // //   ctx.setState({
  // //     ...state,
  // //     feed: !state.feed
  // //   });
  // // }
  //
  // @Action(Increment2Count)
  // increment(ctx: ActionContext<Test2StateModel>, { payload }: Increment2Count) {
  //   const state = ctx.getState();
  //
  //   ctx.setState({
  //     ...state,
  //     aaa: state.aaa + 1
  //   })
  // }
  //
  // @Action(Increment2Count2)
  // increment2(ctx: any) {
  //   const state = ctx.getState();
  //   // console.log(4444, state);
  //   ctx.setState('new state 2')
  // }

}