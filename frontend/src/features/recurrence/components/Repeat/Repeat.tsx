import React from 'react';
import { Select } from 'antd';
import RepeatYearly from './RepeatYearly';
import RepeatMonthly from './RepeatMonthly';
import RepeatWeekly from './RepeatWeekly';
import RepeatDaily from './RepeatDaily';
import RepeatHourly from './RepeatHourly';
const { Option } = Select;

type RepeatProps = {};

type SelectState = {
  value: string;
};

class Repeat extends React.Component<RepeatProps, SelectState> {
  state: SelectState = {
    value: ''
  };

  onChangeValue = (value: string) => {
    this.setState({ value: value });
  };

  render() {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <label>
            <strong>Repeat</strong>
          </label>
          <Select
            placeholder='Choose a type'
            style={{ width: '30%' }}
            value={this.state.value}
            onChange={e => this.onChangeValue(e)}
          >
            <Option value='Yearly'>Yearly</Option>
            <Option value='Monthly'>Monthly</Option>
            <Option value='Weekly'>Weekly</Option>
            <Option value='Daily'>Daily</Option>
            <Option value='Hourly'>Hourly</Option>
          </Select>
        </div>
        {this.state.value === 'Yearly' && <RepeatYearly />}
        {this.state.value === 'Monthly' && <RepeatMonthly />}
        {this.state.value === 'Weekly' && <RepeatWeekly />}
        {this.state.value === 'Daily' && <RepeatDaily />}
        {this.state.value === 'Hourly' && <RepeatHourly />}
      </div>
    );
  }
}

export default Repeat;
