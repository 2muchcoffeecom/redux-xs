import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { rxStore } from 'redux-xs';
import { IncrementCount, IncrementCount2 } from '../../redux/test/test-actions';


interface AppScreenProps {
  count: number,
  dispatch?: any,
}

const mapStateToProps = (state: any): AppScreenProps => ({
  count: state.test.count,
});


class App extends Component<AppScreenProps> {

  onClick = () => {
    rxStore.dispatch(new IncrementCount(10));
    // rxStore.dispatch(new IncrementCount2(10));
  };

  render() {
    const {count} = this.props;

    return (
      <div>
        <button onClick={this.onClick}>increment</button>
        <div>count - {count}</div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(App);
