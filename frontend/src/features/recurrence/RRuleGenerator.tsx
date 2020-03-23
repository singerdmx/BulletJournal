import React from 'react';
import Start from './components/Start/Start';
import Repeat from './components/Repeat/Repeat';
import End from './components/End/End';
//used for redux
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateStartString } from './actions';
import './rrules.styles.less';

type RRuleGeneratorProps = {
  start: any;
  repeat: any;
  end: any;
  rRuleString: string;
};

class ReactRRuleGenerator extends React.Component<RRuleGeneratorProps> {
  render() {
    return (
      <div className='rrules'>
        <div className='rrule-start'>
          <Start />
        </div>
        <div className='rrule-repeate'>
          <Repeat />
        </div>
        <div className='rrule-end'>
          <End />
        </div>
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
