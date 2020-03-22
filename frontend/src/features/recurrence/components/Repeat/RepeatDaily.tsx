import React from 'react';
import { Input } from 'antd';
import { IState } from '../../../../store';
import { connect } from 'react-redux';
import { Daily } from '../../interface';
import { updateRepeatDaily } from '../../actions';

type RepeatDailyProps = {
  repeatDaily: Daily;
  updateRepeatDaily: (repeatDaily: Daily) => void;
};

class RepeatDaily extends React.Component<RepeatDailyProps> {
  onChange = (event: any) => {
    let updateInterval = parseInt(event.target.value ? event.target.value : 0);
    let update = { interval: updateInterval } as Daily;
    this.props.updateRepeatDaily(update);
  };

  render() {
    return (
      <Input
        prefix="Every"
        style={{ width: '20%' }}
        value={
          this.props.repeatDaily.interval ? this.props.repeatDaily.interval : 0
        }
        onChange={this.onChange}
        suffix="Day(s)"
      />
    );
  }
}

const mapStateToProps = (state: IState) => ({
  repeatDaily: state.rRule.repeatDaily
});
export default connect(mapStateToProps, { updateRepeatDaily })(RepeatDaily);
