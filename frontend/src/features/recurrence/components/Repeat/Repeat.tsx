import React from 'react';
import RepeatYearly from './RepeatYearly';
import RepeatMonthly from './RepeatMonthly';
import RepeatWeekly from './RepeatWeekly';
import RepeatDaily from './RepeatDaily';
import RepeatHourly from './RepeatHourly';
import {Select} from 'antd';
//used for redux
import {IState} from '../../../../store';
import {connect} from 'react-redux';
//used for interface
import {MonthlyOn, MonthlyOnThe, YearlyOn, YearlyOnThe,} from '../../interface';
//used for action
import {
  updateFreq,
  updateRepeatDaily,
  updateRepeatHourly,
  updateRepeatMonthlyOn,
  updateRepeatMonthlyOnThe,
  updateRepeatWeeklyCount,
  updateRepeatYearlyOn,
  updateRepeatYearlyOnThe,
  updateStartString,
} from '../../actions';
import {Frequency} from 'rrule';

const { Option } = Select;

type RepeatProps = {
  startDate: string;
  startTime: string;
  interval: number;
  repeatWeekly: any;
  repeatMonthlyOnThe: any;
  repeatMonthlyOn: any;
  repeatYearlyOnThe: any;
  repeatYearlyOn: any;
  monthlyOn: boolean;
  yearlyOn: boolean;
  freq: Frequency;
  updateFreq: (freq: Frequency) => void;
  updateStartString: (startDate: string, startTime: string) => void;
  updateRepeatYearlyOn: (repeatYearlyOn: YearlyOn) => void;
  updateRepeatYearlyOnThe: (repeatYearlyOnThe: YearlyOnThe) => void;
  updateRepeatMonthlyOn: (repeatMonthlyOn: MonthlyOn) => void;
  updateRepeatMonthlyOnThe: (repeatMonthlyOnThe: MonthlyOnThe) => void;
  updateRepeatWeeklyCount: (repeatWeeklyCount: number) => void;
  updateRepeatDaily: (repeatDaily: number) => void;
  updateRepeatHourly: (repeatHourly: number) => void;
};

const frequencies = [
  Frequency.YEARLY,
  Frequency.MONTHLY,
  Frequency.WEEKLY,
  Frequency.DAILY,
  Frequency.HOURLY,
] as Frequency[];

class Repeat extends React.Component<RepeatProps> {
  constructor(props: RepeatProps) {
    super(props);
    this.state = {};
  }

  onChangeValue = (value: Frequency) => {
    this.props.updateFreq(value);
    switch (value) {
      case Frequency.HOURLY:
        this.props.updateRepeatHourly(1);
        break;
      case Frequency.DAILY:
        this.props.updateRepeatDaily(1);
        break;
      case Frequency.WEEKLY:
        this.props.updateRepeatWeeklyCount(1);
        break;
      case Frequency.MONTHLY:
        this.props.updateRepeatMonthlyOn({day: 1});
        break;
      case Frequency.YEARLY:
        this.props.updateRepeatYearlyOn({month: 'Jan', day: 1});
        break;
      default:
    }
    if (value === Frequency.YEARLY) {
      if (this.props.yearlyOn) {
        this.props.updateRepeatYearlyOn(this.props.repeatYearlyOn);
      } else {
        this.props.updateRepeatYearlyOnThe(this.props.repeatYearlyOnThe);
      }
    } else if (value === Frequency.MONTHLY) {
      if (this.props.monthlyOn) {
        this.props.updateRepeatMonthlyOn(this.props.repeatMonthlyOn);
      } else {
        this.props.updateRepeatMonthlyOnThe(this.props.repeatMonthlyOnThe);
      }
    }

  };

  render() {
    return (
      <div>
        <div
          style={{ display: 'flex', alignItems: 'center', paddingBottom: 24 }}
        >
          <label style={{ marginRight: '1em' }}>
            <strong>Repeat : </strong>
          </label>
          <Select
            placeholder="Choose a type"
            style={{ width: '30%' }}
            defaultValue={this.props.freq}
            value={this.props.freq}
            onChange={(e) => this.onChangeValue(e)}
          >
            {frequencies.map((frequency) => {
              return (
                <Option key={frequency} value={frequency}>
                  {Frequency[frequency]}
                </Option>
              );
            })}
          </Select>
        </div>
        {this.props.freq === Frequency.YEARLY && <RepeatYearly />}
        {this.props.freq === Frequency.MONTHLY && <RepeatMonthly />}
        {this.props.freq === Frequency.WEEKLY && <RepeatWeekly />}
        {this.props.freq === Frequency.DAILY && <RepeatDaily />}
        {this.props.freq === Frequency.HOURLY && <RepeatHourly />}
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  startTime: state.rRule.startTime,
  startDate: state.rRule.startDate,
  monthlyOn: state.rRule.monthlyOn,
  yearlyOn: state.rRule.yearlyOn,
  repeatYearlyOn: state.rRule.repeatYearlyOn,
  repeatYearlyOnThe: state.rRule.repeatYearlyOnThe,
  repeatMonthlyOn: state.rRule.repeatMonthlyOn,
  repeatMonthlyOnThe: state.rRule.repeatMonthlyOnThe,
  repeatWeekly: state.rRule.repeatWeekly,
  interval: state.rRule.repeat.interval,
  freq: state.rRule.repeat.freq,
});

export default connect(mapStateToProps, {
  updateFreq,
  updateStartString,
  updateRepeatYearlyOn,
  updateRepeatYearlyOnThe,
  updateRepeatDaily,
  updateRepeatHourly,
  updateRepeatMonthlyOn,
  updateRepeatMonthlyOnThe,
  updateRepeatWeeklyCount,
})(Repeat);
