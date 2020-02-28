import React from 'react';
import TimezonePicker from './timezone';
import ReminderBeforeTaskPicker from './reminder-before-task';
import CurrencyPicker from './currency';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { updateExpandedMyself } from '../../features/myself/actions';
import './account.styles.less';

type AccountProps = {
  updateExpandedMyself: (updateSettings: boolean) => void;
};

class Account extends React.Component<AccountProps> {
  componentDidMount() {
    this.props.updateExpandedMyself(true);
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
        <div className='option-container'>
          <span>Currency&nbsp;&nbsp;&nbsp;</span>
          <CurrencyPicker />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {
  updateExpandedMyself
})(Account);
