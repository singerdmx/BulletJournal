import React from 'react';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
//import translateLabel from '../utils/translateLabel';

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
