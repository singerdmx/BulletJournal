import React from 'react';
import { Input } from 'antd';
import { IState } from '../../../../store';
import { connect } from 'react-redux';
import { Hourly } from '../../interface';
import { updateRepeatHourly } from '../../actions';

type RepeatHourlyProps = {
  repeatHourly: Hourly;
  updateRepeatHourly: (repeatHourly: Hourly) => void;
};

class RepeatHourly extends React.Component<RepeatHourlyProps> {
  onChange = (event: any) => {
    let updateInterval = parseInt(event.target.value ? event.target.value : 0);
    if (isNaN(updateInterval)) updateInterval = 0;
    let update = { interval: updateInterval } as Hourly;
    this.props.updateRepeatHourly(update);
  };

  render() {
    return (
      <Input
        prefix='Every '
        style={{ width: '70%' }}
        value={
          this.props.repeatHourly.interval
            ? this.props.repeatHourly.interval
            : 0
        }
        onChange={this.onChange}
        suffix='Hour(s)'
      />
    );
  }
}

const mapStateToProps = (state: IState) => ({
  repeatHourly: state.rRule.repeatHourly
});
export default connect(mapStateToProps, { updateRepeatHourly })(RepeatHourly);
