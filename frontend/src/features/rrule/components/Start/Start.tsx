import React from 'react';
import { DatePicker } from 'antd';

function onChange(date: any, dateString: string) {
  console.log(date, dateString);
}

const Start = () => (
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <label>
      <strong>Start</strong>
    </label>
    <DatePicker onChange={onChange} />
  </div>
);

export default Start;
