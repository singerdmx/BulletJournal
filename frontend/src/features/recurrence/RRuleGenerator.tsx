import React from 'react';
import Start from './components/Start/Start';
import Repeat from './components/Repeat/Repeat';
import End from './components/End/End';
import './rrules.styles.less';

class ReactRRuleGenerator extends React.Component {
  render() {
    return (
      <div className="rrules">
        <div className="rrule-start">
          <Start />
        </div>
        <div className="rrule-repeate">
          <Repeat />
        </div>
        <div className="rrule-end">
          <End />
        </div>
      </div>
    );
  }
}

export default ReactRRuleGenerator;
