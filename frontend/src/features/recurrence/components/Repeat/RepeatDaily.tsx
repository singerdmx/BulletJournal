import React from 'react';
import { Input } from 'antd';
import { IState } from '../../../../store';
import { connect } from 'react-redux';
import { updateRepeatDaily } from '../../actions';

type RepeatDailyProps = {
  repeatDaily: number;
  updateRepeatDaily: (repeatDaily: number) => void;
};

class RepeatDaily extends React.Component<RepeatDailyProps> {
  onChange = (event: any) => {
    let updateInterval = parseInt(event.target.value ? event.target.value : 0);
    if (isNaN(updateInterval)) updateInterval = 0;
    this.props.updateRepeatDaily(updateInterval);
  };

  render() {
    return (
      <Input
        prefix='Every'
        style={{ width: '40%' }}
        value={this.props.repeatDaily}
        onChange={this.onChange}
        suffix='Day(s)'
      />
    );
  }
}

const mapStateToProps = (state: IState) => ({
  repeatDaily: state.rRule.repeat.interval
});
export default connect(mapStateToProps, { updateRepeatDaily })(RepeatDaily);
