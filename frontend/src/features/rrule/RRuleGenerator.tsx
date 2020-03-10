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
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  rRuleStartString: state.rRule.rRuleStartString,
  startDate: state.rRule.startDate
});

export default connect(mapStateToProps, { updateStartString })(
  ReactRRuleGenerator
);
