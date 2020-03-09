import React from 'react';
import { Input } from 'antd';

type EndProps = {};

type SelectState = {};

class RepeatDaily extends React.Component<EndProps, SelectState> {
  render() {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>every</span>
        <Input style={{ width: '20%' }} />
        <span>day(s)</span>
      </div>
    );
  }
}

export default RepeatDaily;
