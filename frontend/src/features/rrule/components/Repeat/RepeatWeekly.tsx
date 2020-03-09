import React from 'react';
import { Select, Checkbox, Input } from 'antd';
import { DatePicker } from 'antd';
const { Option } = Select;

type EndProps = {};

type SelectState = {};

class RepeatWeekly extends React.Component<EndProps, SelectState> {
  daysArray = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  render() {
    return (
      <div style={{}}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span>every</span>
          <Input style={{ width: '20%' }} />
          <span>week(s)</span>
        </div>

        <div style={{ display: 'flex' }}>
          {this.daysArray.map((dayName: string) => (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                width: '30px',
                marginRight: '30px'
              }}
            >
              <Checkbox
                name={dayName}
                style={{ marginRight: '10px' }}
                checked={true}
              />
              <div>{dayName}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default RepeatWeekly;
