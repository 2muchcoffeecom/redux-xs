import { State, Action, ActionContext, NewState } from 'redux-xs';
import { IncrementCount, IncrementCount2 } from './test-actions';
import { SubstateState } from './substate/substate-state';
import { Observable, of } from 'rxjs';
import { delay, map, mapTo, tap } from 'rxjs/operators';
// import { Action } from '../../../node_modules/redux-xs/dist';
// import { State } from '../../../node_modules/redux-xs/dist';
// import { ActionContext } from '../../../node_modules/redux-xs/dist';

interface TestStateModel {
  count: number,
  qqq: string
}


export function qwe(params: any) {
  return (observable: Observable<any>) => {

    return observable.pipe(
      mapTo(of(params))
    );
  }
}


@State<TestStateModel>({
  name: 'test',
  defaults: {
    count: 5,
    qqq: 'qwe',
  },
  // children: [SubstateState]
})
export class TestState {

  @Action(IncrementCount)
  feedAnimals1(next: NewState<TestStateModel>, state: TestStateModel, action: IncrementCount) {
    return next({
      ...state,
      count: state.count + action.payload
    })
    .pipe(
      map((res) => {
        return new IncrementCount2(3)
      })
    );
  }


  @Action(IncrementCount2)
  feedAnimals2(next: NewState<TestStateModel>, state: TestStateModel, action: IncrementCount2) {
    return next({
      ...state,
      count: state.count + action.payload
    })
    .pipe(
      map((res) => {
        return false
      })
    );
  }

  // @Action(IncrementCount)
  // feedAnimals4(next: NewState<TestStateModel>, state: TestStateModel, action: IncrementCount) {
  //   console.log(action)
  //   return next({
  //     ...state,
  //     count: state.count + action.payload
  //   })
  //   .pipe(
  //     map((res) => {
  //       return res.count
  //     })
  //   );
  // }
  //
  // @Action(IncrementCount)
  // feedAnimals5(next: NewState<TestStateModel>, state: TestStateModel, action: IncrementCount) {
  //   return next({
  //     ...state,
  //     qqq: 'www'
  //   })
  //   .pipe(
  //     map((res) => {
  //       return res.qqq
  //     })
  //   );
  // }

  // @Action(IncrementCount)
  // feedAnimals(ctx: ActionContext<TestStateModel>) {
  //   return of(1234567)
  //   .pipe(
  //     delay(1000),
  //     // map((res)=>{
  //     //   return {state: {count: res}}
  //     // })
  //     qwe({
  //       pathState: (q: any) => {
  //         console.log(111)
  //         return 111;
  //       }
  //     }),
  //     // mapTo(of(111)),
  //   )
  // }

  // @Action(IncrementCount)
  // feedAnimals2(ctx: ActionContext<TestStateModel>) {
  //   return of(1)
  //   .pipe(
  //     delay(2000),
  //     mapTo(of(222)),
  //   )
  // }

  // @Action(IncrementCount)
  // feedAnimals(ctx: StateContext<TestStateModel>) {
  //   const state = ctx.getState();
  //   ctx.setState({
  //     ...state,
  //     feed: !state.feed
  //   });
  // }

  // @Action(IncrementCount)
  // increment(ctx: ActionContext<TestStateModel>, { payload }: IncrementCount) {
  //   const state = ctx.getState();
  //
  //   // ctx.setState({
  //   //   ...state,
  //   //   count: state.count + 1
  //   // })
  //
  //   return of(1)
  //   .pipe(
  //     delay(3000),
  //     tap(() => {
  //       ctx.setState({
  //         ...state,
  //         count: state.count + 1
  //       })
  //     })
  //   )
  // }
  //
  // @Action(IncrementCount2)
  // increment2(ctx: any) {
  //   const state = ctx.getState();
  //   // console.log(4444, state);
  //   ctx.setState('new state 2')
  // }

}