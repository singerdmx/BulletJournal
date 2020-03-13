import React from 'react';
import Start from './components/Start/Start';
import Repeat from './components/Repeat/Repeat';
import End from './components/End/End';
//used for redux
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateStartString } from './actions';
//rrule
import RRule from 'rrule';
import moment from 'moment';

type RRuleGeneratorProps = {
  rRuleString: string;
  updateStartString: (startDate: string) => void;
};

class ReactRRuleGenerator extends React.Component<RRuleGeneratorProps> {
  render() {
    return (
      <div>
        <Start />
        <Repeat />
        <End />
        <div>{this.props.rRuleString}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  rRuleString: state.rRule.rRuleString
});

export default connect(mapStateToProps, { updateStartString })(
  ReactRRuleGenerator
);
