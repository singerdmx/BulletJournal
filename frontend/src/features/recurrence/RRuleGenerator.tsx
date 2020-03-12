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
  startDate: string;
  rRuleStartString: string;
  rRuleEndString: string;
  rRuleRepeatString: string;
  updateStartString: (startDate: string) => void;
};

class ReactRRuleGenerator extends React.Component<RRuleGeneratorProps> {
  render() {
    return (
      <div>
        <Start />
        <Repeat />
        <End />
        {console.log(moment(this.props.startDate).toDate())}
        <div>{this.props.rRuleStartString}</div>
        <div>{this.props.rRuleEndString}</div>
        <div>{this.props.rRuleRepeatString}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  rRuleStartString: state.rRule.rRuleStartString,
  startDate: state.rRule.startDate,
  rRuleEndString: state.rRule.rRuleEndString,
  rRuleRepeatString: state.rRule.rRuleRepeatString
});

export default connect(mapStateToProps, { updateStartString })(
  ReactRRuleGenerator
);
