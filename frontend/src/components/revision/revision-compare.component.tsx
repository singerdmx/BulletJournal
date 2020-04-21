import React, { useEffect } from "react";
import { Content } from "../../features/myBuJo/interface";

type RevisionProps = {
  contentPair: Content[];
};

const RevisionCompare: React.FC<RevisionProps> = ({
  contentPair,
}) => {
  return (
    <div className="revision-container">
      <div className="revision-content left"></div>
      <div className="revision-content right"></div>
    </div>
  );
};

export default RevisionCompare;
