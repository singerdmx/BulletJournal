import React from 'react';
import ReactRRuleGenerator from '../features/rrule/RRuleGenerator';
import translations from '../features/rrule/translations';

const HomePage = () => {
  return (
    <div className='todo'>
      <ReactRRuleGenerator />
    </div>
  );
};

export default HomePage;
export { translations };
