import React from 'react';
import RRuleGenerator from '../features/rrule/RRuleGenerator';
import translations from '../features/rrule/translations';

const HomePage = () => {
  return (
    <div className='todo'>
      <RRuleGenerator />
    </div>
  );
};

export default HomePage;
export { translations };
