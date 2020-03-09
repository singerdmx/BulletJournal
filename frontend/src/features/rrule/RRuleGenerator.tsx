import React, { PureComponent } from 'react';
import Start from './components/Start/Start';
import Repeat from './components/Repeat/Repeat';
import End from './components/End/End';

class ReactRRuleGenerator extends PureComponent {
  render() {
    return (
      <div>
        <Start />
        <Repeat />
        <End />
      </div>
    );
  }
}

export default ReactRRuleGenerator;
