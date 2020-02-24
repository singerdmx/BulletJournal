import React from 'react';
import TimezonePicker from './timezone';
import ReminderBeforeTaskPicker from './reminder-before-task';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { updateExpandedMyself } from '../../features/myself/actions';
import './account.styles.less';

type AccountProps = {
  updateExpandedMyself: () => void;
};

class Account extends React.Component<AccountProps> {
  componentDidMount() {
    this.props.updateExpandedMyself();
  }
  render() {
    return (
      <div>
        <div className='option-container'>
          <span>Time Zone &nbsp;&nbsp;&nbsp;</span> <TimezonePicker />
        </div>
        <div className='option-container'>
          <span>Default Reminder Before Task&nbsp;&nbsp;&nbsp;</span>
          <ReminderBeforeTaskPicker />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  timezone: state.myself.timezone,
  before: state.myself.before
});

export default connect(mapStateToProps, { updateExpandedMyself })(Account);
