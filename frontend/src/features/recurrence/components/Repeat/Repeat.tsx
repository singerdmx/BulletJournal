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
import {Daily, Hourly, MonthlyOn, MonthlyOnThe, Weekly, YearlyOn, YearlyOnThe} from '../../interface';
//used for action
import {
    updateFreq,
    updateRepeatDaily,
    updateRepeatHourly,
    updateRepeatMonthlyOn,
    updateRepeatMonthlyOnThe,
    updateRepeatWeekly,
    updateRepeatYearlyOn,
    updateRepeatYearlyOnThe,
    updateStartString
} from '../../actions';
import {Frequency} from "rrule";

const {Option} = Select;

type RepeatProps = {
    startDate: string;
    startTime: string;
    repeatHourly: any;
    repeatDaily: any;
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
    updateRepeatWeekly: (repeatWeekly: Weekly) => void;
    updateRepeatDaily: (repeatDaily: Daily) => void;
    updateRepeatHourly: (repeatHourly: Hourly) => void;
};

const frequencies = [Frequency.YEARLY, Frequency.MONTHLY, Frequency.WEEKLY, Frequency.DAILY, Frequency.HOURLY] as Frequency[];

class Repeat extends React.Component<RepeatProps> {

    componentDidMount = () => {
        this.props.updateStartString(this.props.startDate, this.props.startTime);
        this.props.updateRepeatYearlyOn(this.props.repeatYearlyOn);
    };

    onChangeValue = (value: Frequency) => {
        this.props.updateFreq(value);
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
        } else if (value === Frequency.WEEKLY) {
            this.props.updateRepeatWeekly(this.props.repeatWeekly);
        } else if (value === Frequency.DAILY) {
            this.props.updateRepeatDaily(this.props.repeatDaily);
        } else if (value === Frequency.HOURLY) {
            this.props.updateRepeatHourly(this.props.repeatHourly);
        }
    };

    render() {
        return (
            <div>
                <div
                    style={{display: 'flex', alignItems: 'center', paddingBottom: 24}}
                >
                    <label style={{marginRight: '1em'}}>
                        <strong>Repeat : </strong>
                    </label>
                    <Select
                        placeholder='Choose a type'
                        style={{width: '30%'}}
                        value={this.props.freq}
                        onChange={e => this.onChangeValue(e)}
                    >
                        {frequencies.map(frequency => {
                            return <Option value={frequency}>{Frequency[frequency]}</Option>
                        })}
                    </Select>
                </div>
                {this.props.freq === Frequency.YEARLY && <RepeatYearly/>}
                {this.props.freq === Frequency.MONTHLY && <RepeatMonthly/>}
                {this.props.freq === Frequency.WEEKLY && <RepeatWeekly/>}
                {this.props.freq === Frequency.DAILY && <RepeatDaily/>}
                {this.props.freq === Frequency.HOURLY && <RepeatHourly/>}
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
    repeatDaily: state.rRule.repeatDaily,
    repeatHourly: state.rRule.repeatHourly,
    freq: state.rRule.freq
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
    updateRepeatWeekly
})(Repeat);
