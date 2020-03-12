import React from 'react';
import { Select, Checkbox } from 'antd';
import { MONTHS, WHICHS, DAYS } from '../../constants/index';
import moment from 'moment';
import { range } from 'lodash';
//used for redux
import { IState } from '../../../../store';
import { connect } from 'react-redux';
//interface
import { YearlyOn, YearlyOnThe } from '../../interface';
//actions
import { updateRepeatYearlyOn, updateRepeatYearlyOnThe } from '../../actions';
const { Option } = Select;

var daysOn = moment('Jan', 'MMM').daysInMonth();

type RepeatYealyProps = {
  repeatYearlyOn: YearlyOn;
  repeatYearlyOnThe: YearlyOnThe;
  updateRepeatYearlyOn: (repeatYearlyOn: YearlyOn) => void;
  updateRepeatYearlyOnThe: (repeatYearlyOnThe: YearlyOnThe) => void;
};

type SelectState = {
  on: boolean;
};

class RepeatYearly extends React.Component<RepeatYealyProps, SelectState> {
  state: SelectState = {
    on: true
  };

  onClickOn = () => {
    this.setState({ on: true });
  };

  onClickOnThe = () => {
    this.setState({ on: false });
  };

  onChangeOnMonth = (e: string) => {
    let update = {
      month: e,
      day: 1
    } as YearlyOn;
    daysOn = moment(e, 'MMM').daysInMonth();
    this.props.updateRepeatYearlyOn(update);
  };

  onChangeOnDay = (e: number) => {
    let update = {
      month: this.props.repeatYearlyOn.month,
      day: e
    } as YearlyOn;
    this.props.updateRepeatYearlyOn(update);
  };

  onChangeOnTheMonth = (e: string) => {
    let update = {
      month: e,
      day: this.props.repeatYearlyOnThe.day,
      which: this.props.repeatYearlyOnThe.which
    } as YearlyOnThe;
    this.props.updateRepeatYearlyOnThe(update);
  };

  onChangeOnTheDay = (e: string) => {
    let update = {
      month: this.props.repeatYearlyOnThe.month,
      day: e,
      which: this.props.repeatYearlyOnThe.which
    } as YearlyOnThe;
    this.props.updateRepeatYearlyOnThe(update);
  };

  onChangeOnTheWhich = (e: string) => {
    let update = {
      month: this.props.repeatYearlyOnThe.month,
      day: this.props.repeatYearlyOnThe.day,
      which: e
    } as YearlyOnThe;
    this.props.updateRepeatYearlyOnThe(update);
  };

  render() {
    return (
      <div>
        <div>
          <Checkbox checked={this.state.on} onClick={this.onClickOn} />
          <span>On</span>
          <Select
            style={{ width: '30%', paddingLeft: '20px' }}
            disabled={!this.state.on}
            onChange={this.onChangeOnMonth}
            value={this.props.repeatYearlyOn.month}
          >
            {MONTHS.map(month => {
              return (
                <Option value={month} key={month}>
                  {month}
                </Option>
              );
            })}
          </Select>
          <Select
            style={{ width: '30%', paddingLeft: '20px' }}
            disabled={!this.state.on}
            onChange={this.onChangeOnDay}
            value={this.props.repeatYearlyOn.day}
          >
            {range(0, daysOn).map(i => (
              <option key={i} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <Checkbox checked={!this.state.on} onClick={this.onClickOnThe} />
          <span>On the</span>
          <Select
            style={{ width: '20%', paddingLeft: '20px' }}
            disabled={this.state.on}
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
            style={{ width: '20%', paddingLeft: '20px' }}
            disabled={this.state.on}
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
            style={{ width: '20%', paddingLeft: '20px' }}
            disabled={this.state.on}
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
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  repeatYearlyOn: state.rRule.repeatYearlyOn,
  repeatYearlyOnThe: state.rRule.repeatYearlyOnThe
});
export default connect(mapStateToProps, {
  updateRepeatYearlyOn,
  updateRepeatYearlyOnThe
})(RepeatYearly);
