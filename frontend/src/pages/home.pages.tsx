import React from 'react';
import RRuleGenerator from '../features/rRule/RRuleGenerator';
import translations from '../features/rRule/translations';

const HomePage = () => {
  return (
    <div className='todo'>
      <RRuleGenerator />
    </div>
  );
};

export default HomePage;
export { translations };
