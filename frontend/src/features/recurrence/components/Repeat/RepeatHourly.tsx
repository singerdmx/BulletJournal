import React from 'react';
import { InputNumber } from 'antd';
import { IState } from '../../../../store';
import { connect } from 'react-redux';
import { updateRepeatHourly } from '../../actions';

type RepeatHourlyProps = {
  repeatHourly: number;
  updateRepeatHourly: (repeatHourly: number) => void;
};

class RepeatHourly extends React.Component<RepeatHourlyProps> {
  onChange = (event: any) => {
    if (isNaN(event)) {
      event = 1;
    }
    this.props.updateRepeatHourly(event);
  };

  render() {
    return (
      <div>
        <span>Every</span>
        {'  '}
        <InputNumber
          style={{ width: '50px' }}
          value={this.props.repeatHourly}
          onChange={this.onChange}
        />
        {'  '}
        <span>Hour(s)</span>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  repeatHourly: state.rRule.repeat.interval
});
export default connect(mapStateToProps, { updateRepeatHourly })(RepeatHourly);
