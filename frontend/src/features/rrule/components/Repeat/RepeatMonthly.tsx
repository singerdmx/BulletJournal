import React from 'react';
import { Select, Input, Checkbox } from 'antd';
const { Option } = Select;

type EndProps = {};

type SelectState = {};

class RepeatMonthly extends React.Component<EndProps, SelectState> {
  render() {
    return (
      <div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>every</span>
          <Input style={{ width: '20%' }} />
          <span>week(s)</span>
        </div>

        <div>
          <div>
            <Checkbox />
            <span>On day</span>
            <Select style={{ width: '30%' }}>
              <Option value='a'>a</Option>
            </Select>
          </div>
          <div>
            <Checkbox />
            <span>On the</span>
            <Select style={{ width: '30%' }}>
              <Option value='a'>a</Option>
            </Select>
            <Select style={{ width: '30%' }}>
              <Option value='a'>a</Option>
            </Select>
          </div>
        </div>
      </div>
    );
  }
}

export default RepeatMonthly;
