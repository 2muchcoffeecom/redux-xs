import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { rxStore } from 'redux-xs';
import { IncrementCount } from '../../redux/test/test-actions';


interface AppScreenProps {
  count: number,
  dispatch?: any,
}

const mapStateToProps = (state: RootState): AppScreenProps => ({
  count: state.application.count,
});


class App extends Component<AppScreenProps> {

  onClick = () => {
    rxStore.dispatch(new IncrementCount(10))
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
