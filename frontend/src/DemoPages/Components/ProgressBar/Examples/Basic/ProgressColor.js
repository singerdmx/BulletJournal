import React from 'react';
import { Progress } from 'reactstrap';

const ProgressColorExample = (props) => {
  return (
    <div>
      <Progress className="mb-3" value={2 * 5} />
      <Progress className="mb-3" color="success" value="25" />
      <Progress className="mb-3" color="info" value={50} />
      <Progress className="mb-3" color="warning" value={75} />
      <Progress color="danger" value="100" />
    </div>
  );
};

export default ProgressColorExample;
