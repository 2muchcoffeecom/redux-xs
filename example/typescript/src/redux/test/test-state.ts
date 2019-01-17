import { State, Action, ActionContext, NewState } from 'redux-xs';
import { IncrementCount, IncrementCount2 } from './test-actions';
import { SubstateState } from './substate/substate-state';
import { Observable, of } from 'rxjs';
import { delay, map, mapTo, tap } from 'rxjs/operators';
import { Substate2State } from './substate/substate2/substate2-state';
// import { Action } from '../../../node_modules/redux-xs/dist';
// import { State } from '../../../node_modules/redux-xs/dist';
// import { ActionContext } from '../../../node_modules/redux-xs/dist';

interface TestStateModel {
  count: number,
  qqq: string
}


@State<TestStateModel>({
  name: 'test',
  defaults: {
    count: 5,
    qqq: 'qwe',
  },
  children: [SubstateState]
})
export class TestState {

  // @Action(IncrementCount)
  // feedAnimals1(next: NewState<TestStateModel>, state: TestStateModel, action: IncrementCount) {
  //   return next({
  //     ...state,
  //     count: state.count + action.payload
  //   })
  //   .pipe(
  //     mapTo(new IncrementCount2(3))
  //   );
  // }
  //
  // @Action(IncrementCount2)
  // feedAnimals11(next: NewState<TestStateModel>, state: TestStateModel, action: IncrementCount) {
  //   return next({
  //     ...state,
  //     qqq: 'www'
  //   })
  //   // .pipe(
  //   //   map((res) => {
  //   //     return new IncrementCount2(3)
  //   //   })
  //   // );
  // }
  //
  //
  // @Action(IncrementCount)
  // feedAnimals2(next: NewState<TestStateModel>, state: TestStateModel, action: IncrementCount2) {
  //   return next({
  //     ...state,
  //     count: state.count + action.payload,
  //   })
  // }


  @Action(IncrementCount)
  feedAnimals2(next: NewState<any>, state: any, action: IncrementCount2) {
    console.log(45345345345, state);
    return next({
      ...state,
      count: state.count + action.payload,
      substate: {
        ...state.substate,
        count: 100,
        // substate2: {
        //   count: 100
        // },
      },
    })
  }

  @Action(IncrementCount)
  feedAnimals3(next: NewState<any>, state: any, action: IncrementCount2) {
    return next({
      ...state,
      count: state.count + action.payload,
      substate: {
        count: state.substate.count + action.payload,
      },
    })
  }







  //
  // @Action(IncrementCount)
  // feedAnimals5(next: NewState<TestStateModel>, state: TestStateModel, action: IncrementCount) {
  //   return next({
  //     ...state,
  //     qqq: 'www'
  //   })
  //   .pipe(
  //     map((res) => {
  //       return false
  //     })
  //   );
  // }

}