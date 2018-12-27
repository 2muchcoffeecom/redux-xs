import React, { Component } from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { IncrementAction } from '../../redux/application/application-actions';
import { rxStore } from 'redux-xs';


interface AppScreenProps {
  count: number,
  dispatch?: any,
}

const mapStateToProps = (state: RootState): AppScreenProps => ({
  count: state.application.count,
});

class App extends Component<AppScreenProps> {

  onClick = () => {
    rxStore.dispatch(new IncrementAction())
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
