import React from 'react';
import TimezonePicker from './timezone';
import { connect } from 'react-redux';
import { IState } from '../../store';

type AccountProps = {};

class Account extends React.Component<AccountProps> {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>Time Zone &nbsp;&nbsp;&nbsp;</span> <TimezonePicker />
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  timezone: state.myself.timezone
});

export default connect(mapStateToProps, {})(Account);
