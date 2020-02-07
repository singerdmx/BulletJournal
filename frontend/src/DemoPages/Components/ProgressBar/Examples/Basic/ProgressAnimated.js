import React from 'react';
import { Progress } from 'reactstrap';

const ProgressAnimatedExample = (props) => {
  return (
    <div>
      <Progress className="mb-3" animated value={2 * 5} />
      <Progress className="mb-3" animated color="success" value="25" />
      <Progress className="mb-3" animated color="info" value={50} />
      <Progress className="mb-3" animated color="warning" value={75} />
      <Progress className="mb-3" animated color="danger" value="100" />
      <Progress multi>
        <Progress animated bar value="10" />
        <Progress animated bar color="success" value="30" />
        <Progress animated bar color="warning" value="20" />
        <Progress animated bar color="danger" value="20" />
      </Progress>
        <div className="divider"> </div>
        <Progress className="mb-3 progress-bar-animated-alt" value={2 * 5} />
        <Progress className="mb-3 progress-bar-animated-alt" color="success" value="25" />
        <Progress className="mb-3 progress-bar-animated-alt" color="info" value={50} />
        <Progress className="mb-3 progress-bar-animated-alt" color="warning" value={75} />
        <Progress className="mb-3 progress-bar-animated-alt" color="danger" value="100" />
        <Progress multi>
            <Progress className="progress-bar-animated-alt" bar value="10" />
            <Progress className="progress-bar-animated-alt" bar color="success" value="30" />
            <Progress className="progress-bar-animated-alt" bar color="warning" value="20" />
            <Progress className="progress-bar-animated-alt" bar color="danger" value="20" />
        </Progress>
    </div>
  );
};

export default ProgressAnimatedExample;
