import React from 'react';
import { Progress } from 'reactstrap';

const ProgressExample = (props) => {
  return (
    <div>
      <div className="text-center">0%</div>
      <Progress className="mb-3" />
      <div className="text-center">25%</div>
      <Progress className="mb-3" value="25" />
      <div className="text-center">50%</div>
      <Progress className="mb-3" value={50} />
      <div className="text-center">75%</div>
      <Progress className="mb-3" value={75} />
      <div className="text-center">100%</div>
      <Progress className="mb-3" value="100" />
      <div className="text-center">Multiple bars</div>
      <Progress multi>
        <Progress bar value="15" />
        <Progress bar color="success" value="30" />
        <Progress bar color="info" value="25" />
        <Progress bar color="warning" value="20" />
        <Progress bar color="danger" value="5" />
      </Progress>
    </div>
  );
};

export default ProgressExample;
