import React from 'react';
import { Progress } from 'reactstrap';

const ProgressSizingExample = (props) => {
  return (
    <div>
        <Progress className="progress-bar-sm mb-3" />
        <Progress className="progress-bar-sm mb-3" value="25" />
        <Progress className="progress-bar-sm mb-3" value={50} />
        <Progress className="progress-bar-sm mb-3" value={75} />
        <Progress className="progress-bar-sm mb-3" value="100" />
        <Progress className="progress-bar-sm" multi>
            <Progress bar value="15" />
            <Progress bar color="success" value="30" />
            <Progress bar color="info" value="25" />
            <Progress bar color="warning" value="20" />
            <Progress bar color="danger" value="5" />
        </Progress>
        <div className="divider"> </div>
        <Progress className="progress-bar-xs mb-3" />
        <Progress className="progress-bar-xs mb-3" value="25" />
        <Progress className="progress-bar-xs mb-3" value={50} />
        <Progress className="progress-bar-xs mb-3" value={75} />
        <Progress className="progress-bar-xs mb-3" value="100" />
        <Progress className="progress-bar-xs" multi>
            <Progress bar value="15" />
            <Progress bar color="success" value="30" />
            <Progress bar color="info" value="25" />
            <Progress bar color="warning" value="20" />
            <Progress bar color="danger" value="5" />
        </Progress>
    </div>
  );
};

export default ProgressSizingExample;
