import React from 'react';
import RRuleGenerator from '../features/recurrence/RRuleGenerator';
import translations from '../features/recurrence/translations';

const HomePage = () => {
  return (
    <div className='todo'>
      <RRuleGenerator />
    </div>
  );
};

export default HomePage;
export { translations };
