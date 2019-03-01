import 'reflect-metadata';
import * as reselect from 'reselect'

import { State } from '../../state';
import { xsStore } from '../../xs-store.service';
import { createSelector } from '../../utils/create-selector';


describe('Create Selector', () => {

  const subState2 = {
    sub2Count: 33
  };
  const subState = {
    subCount: 22,
    numbers: [1,2,3,4,5,6,7,8,9],
    subState2
  };
  const testState = {
    testCount: 1,
    subState
  };

  const rootState = {
    testState
  }

  @State<any>({
    name: 'subState2',
    defaults: subState2
  })
  class SubState2 {
  }

  @State<any>({
    name: 'subState',
    defaults: subState,
    children: [SubState2]
  })
  class SubState {
  }

  @State<any>({
    name: 'testState',
    defaults: testState,
    children: [SubState]
  })
  class TestState {
  }

  beforeAll(() => {
    xsStore.createStore({
      states: [
        TestState,
        SubState
      ]
    });
  });


  describe('Function Selectors', () => {
    it('should return rootState', () => {
      const state = createSelector((state) => state)(rootState);
      expect(state).toEqual(rootState);
    });

    it('should return testState', () => {
      const state = createSelector((state) => state.testState)(rootState);
      expect(state).toEqual(rootState.testState);
    });

    it('should return 1', () => {
      const state = createSelector((state) => state.testState.testCount)(rootState);
      expect(state).toEqual(1);
    });

    it('should return subState', () => {
      const state = createSelector((state) => state.testState.subState)(rootState);
      expect(state).toEqual(rootState.testState.subState);
    });
  });



  describe('State Selectors', () => {
    it('should return TestState', () => {
      const state = createSelector(TestState)(rootState);
      expect(state).toEqual(rootState.testState);
    });

    it('should return SubState', () => {
      const state = createSelector(SubState)(rootState);
      expect(state).toEqual(rootState.testState.subState);
    });

    it('should return SubState', () => {
      const state = createSelector(SubState2)(rootState);
      expect(state).toEqual(rootState.testState.subState.subState2);
    });
  });

  describe('Dynamic Selectors', () => {
    it('should return testState.testCount + subState.count', () => {
      const state = createSelector([TestState, SubState], (testState, subState) => {
        return testState.testCount + subState.subCount;
      })(rootState);

      expect(state).toEqual(23);
    });

    it('should return subState numbers > 5', () => {
      const numbers = createSelector([SubState], (subState) => {
        return subState.numbers.filter(number => number > 5)
      })(rootState);

      expect(numbers).toEqual([6, 7, 8, 9]);
    });

    it('should return subState numbers > params', () => {
      function selector(params) {
        return createSelector([SubState], (subState) => {
          return subState.numbers.filter(number => number > params)
        })
      }
      const numbers = selector(3)(rootState);
      expect(numbers).toEqual([4, 5, 6, 7, 8, 9]);
    });
  });

  describe('Combined Selectors', () => {
    let combinedSelector;
    let testCountSelector;
    let selector;

    beforeAll(() => {
      testCountSelector = reselect.createSelector([(state: any) => state.testState], (testState) => testState.testCount)
      selector = (params) => {
        return createSelector([SubState], (subState) => {
          return subState.numbers.filter(number => number > params)
        })
      };

      combinedSelector = createSelector(
        [
          selector(3),
          createSelector((state) => state.testState),
          testCountSelector
        ],
        ((numbers, testState, testCount) => {
          return {numbers, testState, testCount}
        })
      );
    });

    it('should return combined states', () => {
      const data = combinedSelector(rootState);
      expect(data).toEqual({
        numbers: [4, 5, 6, 7, 8, 9],
        testState: rootState.testState,
        testCount: 1
      });
    });

    it('using selector in selector', () => {
      const data = createSelector([combinedSelector], (state) => state.testCount)(rootState);
      expect(data).toEqual(1);
    });
  });
});