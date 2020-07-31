import React from 'react';
import { Checkbox, InputNumber } from 'antd';
//used for redux
import { IState } from '../../../../store';
import { connect } from 'react-redux';
//interface
import { Weekly } from '../../interface';
//actions
import { updateRepeatWeeklyCount, updateRepeatWeekly } from '../../actions';
const daysArray = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as string[];
type RepeatWeeklyProps = {
  repeatWeeklyCount: number;
  repeatWeekly: Weekly;
  updateRepeatWeeklyCount: (repeatWeeklyCount: number) => void;
  updateRepeatWeekly: (repeatWeekly: Weekly) => void;
};

type SelectState = {};

class RepeatWeekly extends React.Component<RepeatWeeklyProps, SelectState> {
  onChangeCount = (e: any) => {
    let update = e >= 1 ? e : 1;

    this.props.updateRepeatWeeklyCount(update);
  };

  onClick = (e: any) => {
    const update = {
      ...this.props.repeatWeekly
    } as Weekly;
    if (e.target.value === 'mon') {
      update['mon'] = !update['mon'];
    } else if (e.target.value === 'tue') {
      update['tue'] = !update['tue'];
    } else if (e.target.value === 'wed') {
      update['wed'] = !update['wed'];
    } else if (e.target.value === 'thu') {
      update['thu'] = !update['thu'];
    } else if (e.target.value === 'fri') {
      update['fri'] = !update['fri'];
    } else if (e.target.value === 'sat') {
      update['sat'] = !update['sat'];
    } else if (e.target.value === 'sun') {
      update['sun'] = !update['sun'];
    }
    this.props.updateRepeatWeekly(update);
  };

  render() {
    return (
      <div style={{}}>
        <div style={{ marginBottom: 24 }}>


          <span>Every</span>
          {'  '}
          <InputNumber
            style={{ width: '50px' }}
            value={this.props.repeatWeeklyCount}
            onChange={this.onChangeCount}
          />
          {'  '}
          <span>Week(s)</span>
        </div>

        <div style={{ display: 'flex' }}>
          {daysArray.map((dayName: string, index: number) => {
            let checkState = false;
            if (dayName === 'Mon') checkState = this.props.repeatWeekly['mon'];
            else if (dayName === 'Tue')
              checkState = this.props.repeatWeekly['tue'];
            else if (dayName === 'Wed')
              checkState = this.props.repeatWeekly['wed'];
            else if (dayName === 'Thu')
              checkState = this.props.repeatWeekly['thu'];
            else if (dayName === 'Fri')
              checkState = this.props.repeatWeekly['fri'];
            else if (dayName === 'Sat')
              checkState = this.props.repeatWeekly['sat'];
            else if (dayName === 'Sun')
              checkState = this.props.repeatWeekly['sun'];

            return (
              <div
                key={dayName}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  width: '30px',
                  marginRight: '30px'
                }}
              >
                <Checkbox
                  key={dayName}
                  name={dayName}
                  value={dayName.toLowerCase()}
                  style={{ marginRight: '10px' }}
                  checked={checkState}
                  onClick={this.onClick}
                />
                <div>{dayName}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  repeatWeeklyCount: state.rRule.repeat.interval,
  repeatWeekly: state.rRule.repeatWeekly
});
export default connect(mapStateToProps, {
  updateRepeatWeeklyCount,
  updateRepeatWeekly
})(RepeatWeekly);
