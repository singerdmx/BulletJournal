import React from 'react';
import { Input } from 'antd';
import { IState } from '../../../../store';
import { connect } from 'react-redux';
import { updateRepeatHourly } from '../../actions';

type RepeatHourlyProps = {
  repeatHourly: number;
  updateRepeatHourly: (repeatHourly: number) => void;
};

class RepeatHourly extends React.Component<RepeatHourlyProps> {
  onChange = (event: any) => {
    let updateInterval = parseInt(event.target.value ? event.target.value : 1);
    if (isNaN(updateInterval)) updateInterval = 1;
    this.props.updateRepeatHourly(updateInterval);
  };

  render() {
    return (
      <Input
        prefix='Every '
        style={{ width: '40%' }}
        value={this.props.repeatHourly}
        onChange={this.onChange}
        suffix='Hour(s)'
      />
    );
  }
}

const mapStateToProps = (state: IState) => ({
  repeatHourly: state.rRule.repeat.interval
});
export default connect(mapStateToProps, { updateRepeatHourly })(RepeatHourly);
