import React from 'react';
import { Select, Checkbox } from 'antd';
const { Option } = Select;

type EndProps = {};

type SelectState = {};

class RepeatYearly extends React.Component<EndProps, SelectState> {
  render() {
    return (
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
    );
  }
}

export default RepeatYearly;
