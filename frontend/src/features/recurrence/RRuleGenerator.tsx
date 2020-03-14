import React from 'react';
import Start from './components/Start/Start';
import Repeat from './components/Repeat/Repeat';
import End from './components/End/End';
//used for redux
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateStartString } from './actions';
import RRule from 'rrule';

type RRuleGeneratorProps = {
  start: any;
  repeat: any;
  end: any;
  rRuleString: string;
  updateStartString: (startDate: string) => void;
};

class ReactRRuleGenerator extends React.Component<RRuleGeneratorProps> {
  render() {
    let test = new RRule({
      ...this.props.start,
      ...this.props.repeat,
      ...this.props.end
    });

    return (
      <div>
        <Start />
        <Repeat />
        <End />
        <div>{this.props.rRuleString}</div>
        <br />
        <div>{test.toText()}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  rRuleString: state.rRule.rRuleString,
  start: state.rRule.start,
  repeat: state.rRule.repeat,
  end: state.rRule.end
});

export default connect(mapStateToProps, { updateStartString })(
  ReactRRuleGenerator
);
