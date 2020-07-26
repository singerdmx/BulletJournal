import React from 'react';
import { DatePicker, TimePicker } from 'antd';
//used for redux
import { IState } from '../../../../store';
import { connect } from 'react-redux';
import { updateStartString } from '../../actions';
import moment from 'moment';

type StartProps = {
  startDate: string;
  startTime: string;
  updateStartString: (startDate: string, startTime: string) => void;
};

class Start extends React.Component<StartProps> {

  onChange = (date: any, dateString: string) => {
    this.props.updateStartString(dateString, this.props.startTime);
  };

  onChangeTime = (date: any, dateString: string) => {
    this.props.updateStartString(this.props.startDate, dateString);
  };

  render() {
    const time = '2001-01-01 ' + this.props.startTime;
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label style={{ marginRight: '1em' }}>
          <strong>Start :</strong>
        </label>
        <DatePicker
          value={this.props.startDate ? moment(this.props.startDate) : null}
          onChange={this.onChange}
          allowClear={false}
        />
        <TimePicker
          allowClear={false}
          placeholder="Time"
          value={this.props.startTime ? moment(time) : null}
          onChange={this.onChangeTime}
          format="HH:mm"
        />
      </div>
    );
  }
}
const mapStateToProps = (state: IState) => ({
  startDate: state.rRule.startDate,
  startTime: state.rRule.startTime,
});

export default connect(mapStateToProps, { updateStartString })(Start);
