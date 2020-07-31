import React from 'react';
import { InputNumber } from 'antd';
import { IState } from '../../../../store';
import { connect } from 'react-redux';
import { updateRepeatDaily } from '../../actions';

type RepeatDailyProps = {
  repeatDaily: number;
  updateRepeatDaily: (repeatDaily: number) => void;
};

class RepeatDaily extends React.Component<RepeatDailyProps> {
  onChange = (event: any) => {
    if (isNaN(event)) {
      event = 1;
    }
    this.props.updateRepeatDaily(event);
  };


  render() {
    return (
      <div>
        <span>Every</span>
        {'  '}
        <InputNumber
          style={{ width: '50px' }}
          value={this.props.repeatDaily}
          onChange={this.onChange}
        />
        {'  '}
        <span>Day(s)</span>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  repeatDaily: state.rRule.repeat.interval
});
export default connect(mapStateToProps, { updateRepeatDaily })(RepeatDaily);
