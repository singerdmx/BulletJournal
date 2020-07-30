import React from 'react';
import { Select, InputNumber, Radio } from 'antd';
import { range } from 'lodash';
import { WHICHS, DAYS } from '../../constants/index';
//used for redux
import { IState } from '../../../../store';
import { connect } from 'react-redux';
//interface
import { MonthlyOn, MonthlyOnThe } from '../../interface';
//actions
import {
  updateRepeatMonthlyOn,
  updateRepeatMonthlyOnThe,
  updateRepeatMonthlyCount,
  updateMonthlyOn,
} from '../../actions';
const { Option } = Select;

type RepeatMonthlyProps = {
  monthlyOn: boolean;
  repeatMonthlyOn: MonthlyOn;
  repeatMonthlyOnThe: MonthlyOnThe;
  repeatMonthlyCount: number;
  updateRepeatMonthlyOn: (repeatMonthlyOn: MonthlyOn) => void;
  updateRepeatMonthlyOnThe: (repeatMonthlyOnThe: MonthlyOnThe) => void;
  updateRepeatMonthlyCount: (repeatMonthlyCount: number) => void;
  updateMonthlyOn: (monthlyOn: boolean) => void;
};

class RepeatMonthly extends React.Component<RepeatMonthlyProps> {
  onChange = (e: any) => {
    if (e.target.value === 'on') {
      this.props.updateMonthlyOn(true);
      //update rrule string
      let update = {
        day: this.props.repeatMonthlyOn.day,
      } as MonthlyOn;
      this.props.updateRepeatMonthlyOn(update);
    } else {
      this.props.updateMonthlyOn(false);
      //update rrule string
      let update = {
        day: this.props.repeatMonthlyOnThe.day,
        which: this.props.repeatMonthlyOnThe.which,
      } as MonthlyOnThe;
      this.props.updateRepeatMonthlyOnThe(update);
    }
  };

  onChangeCount = (e: any) => {
    let update = e >= 1 ? e : 1;
    this.props.updateRepeatMonthlyCount(update);
  };

  onChangeOnDay = (e: any) => {
    let update = {
      day: e,
    } as MonthlyOn;
    this.props.updateRepeatMonthlyOn(update);
  };

  onChangeOnTheDay = (e: any) => {
    let update = {
      day: e,
      which: this.props.repeatMonthlyOnThe.which,
    } as MonthlyOnThe;
    this.props.updateRepeatMonthlyOnThe(update);
  };

  onChangeOnTheWhich = (e: any) => {
    let update = {
      day: this.props.repeatMonthlyOnThe.day,
      which: e,
    } as MonthlyOnThe;
    this.props.updateRepeatMonthlyOnThe(update);
  };

  render() {
    return (
      <div style={{ display: 'flex' }}>
        <div style={{ marginBottom: 24 }}>

          <span>Every</span>
          {'  '}
          <InputNumber
            style={{ width: '50px' }}
            value={this.props.repeatMonthlyCount}
            onChange={this.onChangeCount}
          />
          {'  '}
          <span>Month(s)</span>
        </div>

        <Radio.Group
          onChange={this.onChange}
          value={this.props.monthlyOn ? 'on' : 'onThe'}
        >
          <Radio value="on" style={{ marginBottom: 24 }}>
            <span>On day</span>
            <Select
              style={{ width: '90px', paddingLeft: '20px' }}
              disabled={!this.props.monthlyOn}
              onChange={this.onChangeOnDay}
              value={this.props.repeatMonthlyOn.day}
            >
              {range(0, 31).map((i) => (
                <Option key={i} value={i + 1}>
                  {i + 1}
                </Option>
              ))}
            </Select>
          </Radio>
          <br />
          <Radio value="onThe">
            <span>On the</span>
            <Select
              style={{ width: '90px', paddingLeft: '20px' }}
              disabled={this.props.monthlyOn}
              onChange={this.onChangeOnTheWhich}
              value={this.props.repeatMonthlyOnThe.which}
            >
              {WHICHS.map((which: string) => {
                return (
                  <Option value={which} key={which}>
                    {which}
                  </Option>
                );
              })}
            </Select>
            <Select
              style={{ width: '90px', paddingLeft: '20px' }}
              disabled={this.props.monthlyOn}
              onChange={this.onChangeOnTheDay}
              value={this.props.repeatMonthlyOnThe.day}
            >
              {DAYS.map((day: string) => {
                return (
                  <Option value={day} key={day}>
                    {day}
                  </Option>
                );
              })}
            </Select>
          </Radio>
        </Radio.Group>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  repeatMonthlyOn: state.rRule.repeatMonthlyOn,
  repeatMonthlyOnThe: state.rRule.repeatMonthlyOnThe,
  repeatMonthlyCount: state.rRule.repeat.interval,
  monthlyOn: state.rRule.monthlyOn,
});
export default connect(mapStateToProps, {
  updateRepeatMonthlyOn,
  updateRepeatMonthlyOnThe,
  updateRepeatMonthlyCount,
  updateMonthlyOn,
})(RepeatMonthly);
