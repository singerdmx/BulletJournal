import React from 'react';
import { Select, Input } from 'antd';
import { DatePicker } from 'antd';
const { Option } = Select;

type EndProps = {};

type SelectState = {
  value: string;
  after: number;
  onDate: any;
  onDateString: string;
};

class End extends React.Component<EndProps, SelectState> {
  state: SelectState = {
    value: '',
    after: 0,
    onDate: '',
    onDateString: ''
  };

  onChangeValue = (value: string) => {
    this.setState({ value: value });
  };

  onChangeDate = (date: any, dateString: string) => {
    this.setState({ onDate: date, onDateString: dateString });
  };

  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <label>
          <strong>End</strong>
        </label>
        <Select
          placeholder='Choose a type'
          style={{ width: '30%' }}
          value={this.state.value}
          onChange={e => this.onChangeValue(e)}
        >
          <Option value='Never'>Never</Option>
          <Option value='After'>After</Option>
          <Option value='onDate'>On Date</Option>
        </Select>
        {this.state.value === 'onDate' ? (
          <DatePicker value={this.state.onDate} onChange={this.onChangeDate} />
        ) : this.state.value === 'After' ? (
          <div style={{ width: '40%', display: 'flex', alignItems: 'center' }}>
            <Input />
            <div>executions.</div>
          </div>
        ) : null}
      </div>
    );
  }
}

export default End;
