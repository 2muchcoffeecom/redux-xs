import 'reflect-metadata';

import { State } from '../../state';
import { xsStore } from '../../xs-store.service';
import { getReducerPath } from '../../utils/get-reducer-path';

describe('Get Reducer Path Util', () => {

  @State<any>({
    name: 'substate2',
    defaults: {}
  })
  class SubState2 {
  }

  @State<any>({
    name: 'substate',
    defaults: {},
    children: [SubState2]
  })
  class SubState {
  }

  @State<any>({
    name: 'test',
    defaults: {},
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


  it('should return path with parents path', () => {
    const path = getReducerPath(SubState2);
    expect(path).toEqual(['test', 'substate', 'substate2']);
  });

  it('should return empty array', () => {
    const path = getReducerPath(null);
    expect(path).toEqual([]);
  });

});