import React from 'react';
import { Select, Radio } from 'antd';
import { MONTHS, WHICHS, DAYS } from '../../constants/index';
import moment from 'moment';
import { range } from 'lodash';
//used for redux
import { IState } from '../../../../store';
import { connect } from 'react-redux';
//interface
import { YearlyOn, YearlyOnThe } from '../../interface';
//actions
import {
  updateRepeatYearlyOn,
  updateRepeatYearlyOnThe,
  updateYearlyOn,
} from '../../actions';
const { Option } = Select;

var daysOn = moment('Jan', 'MMM').daysInMonth();

type RepeatYealyProps = {
  yearlyOn: boolean;
  repeatYearlyOn: YearlyOn;
  repeatYearlyOnThe: YearlyOnThe;
  updateRepeatYearlyOn: (repeatYearlyOn: YearlyOn) => void;
  updateRepeatYearlyOnThe: (repeatYearlyOnThe: YearlyOnThe) => void;
  updateYearlyOn: (yearlyOn: boolean) => void;
};

class RepeatYearly extends React.Component<RepeatYealyProps> {
  onChange = (e: any) => {
    if (e.target.value === 'on') {
      this.props.updateYearlyOn(true);
      //update rrule string
      let update = {
        month: this.props.repeatYearlyOn.month,
        day: this.props.repeatYearlyOn.day,
      } as YearlyOn;
      this.props.updateRepeatYearlyOn(update);
    } else {
      this.props.updateYearlyOn(false);
      //update rrule string
      let update = {
        month: this.props.repeatYearlyOnThe.month,
        day: this.props.repeatYearlyOnThe.day,
        which: this.props.repeatYearlyOnThe.which,
      } as YearlyOnThe;
      this.props.updateRepeatYearlyOnThe(update);
    }
  };

  onChangeOnMonth = (e: string) => {
    let update = {
      month: e,
      day: 1,
    } as YearlyOn;
    daysOn = moment(e, 'MMM').daysInMonth();
    this.props.updateRepeatYearlyOn(update);
  };

  onChangeOnDay = (e: number) => {
    let update = {
      month: this.props.repeatYearlyOn.month,
      day: e,
    } as YearlyOn;
    this.props.updateRepeatYearlyOn(update);
  };

  onChangeOnTheMonth = (e: string) => {
    let update = {
      month: e,
      day: this.props.repeatYearlyOnThe.day,
      which: this.props.repeatYearlyOnThe.which,
    } as YearlyOnThe;
    this.props.updateRepeatYearlyOnThe(update);
  };

  onChangeOnTheDay = (e: string) => {
    let update = {
      month: this.props.repeatYearlyOnThe.month,
      day: e,
      which: this.props.repeatYearlyOnThe.which,
    } as YearlyOnThe;
    this.props.updateRepeatYearlyOnThe(update);
  };

  onChangeOnTheWhich = (e: string) => {
    let update = {
      month: this.props.repeatYearlyOnThe.month,
      day: this.props.repeatYearlyOnThe.day,
      which: e,
    } as YearlyOnThe;
    this.props.updateRepeatYearlyOnThe(update);
  };

  render() {
    return (
      <div>
        <Radio.Group
          onChange={this.onChange}
          value={this.props.yearlyOn ? 'on' : 'onThe'}
        >
          <Radio value="on" style={{ marginBottom: 24 }}>
            <span>On</span>
            <Select
              style={{ width: '100px', paddingLeft: '20px' }}
              disabled={!this.props.yearlyOn}
              onChange={this.onChangeOnMonth}
              value={this.props.repeatYearlyOn.month}
            >
              {MONTHS.map((month) => {
                return (
                  <Option value={month} key={month}>
                    {month}
                  </Option>
                );
              })}
            </Select>
            <Select
              style={{ width: '100px', paddingLeft: '20px' }}
              disabled={!this.props.yearlyOn}
              onChange={this.onChangeOnDay}
              value={this.props.repeatYearlyOn.day}
            >
              {range(0, daysOn).map((i) => (
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
              style={{ width: '100px', paddingLeft: '20px' }}
              disabled={this.props.yearlyOn}
              onChange={this.onChangeOnTheWhich}
              value={this.props.repeatYearlyOnThe.which}
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
              style={{ width: '100px', margin: '0 20px' }}
              disabled={this.props.yearlyOn}
              onChange={this.onChangeOnTheDay}
              value={this.props.repeatYearlyOnThe.day}
            >
              {DAYS.map((day: string) => {
                return (
                  <Option value={day} key={day}>
                    {day}
                  </Option>
                );
              })}
            </Select>
            <span>Of</span>
            <Select
              style={{ width: '100px', paddingLeft: '20px' }}
              disabled={this.props.yearlyOn}
              onChange={this.onChangeOnTheMonth}
              value={this.props.repeatYearlyOnThe.month}
            >
              {MONTHS.map((month: string) => {
                return (
                  <Option value={month} key={month}>
                    {month}
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
  repeatYearlyOn: state.rRule.repeatYearlyOn,
  repeatYearlyOnThe: state.rRule.repeatYearlyOnThe,
  yearlyOn: state.rRule.yearlyOn,
});
export default connect(mapStateToProps, {
  updateRepeatYearlyOn,
  updateRepeatYearlyOnThe,
  updateYearlyOn,
})(RepeatYearly);
