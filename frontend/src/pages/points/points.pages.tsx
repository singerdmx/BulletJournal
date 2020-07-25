import React, {useEffect} from 'react';

import './points.styles.less';
import {BackTop} from "antd";

type PointsProps = {
};

const PointsPage: React.FC<PointsProps> = (props) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Points';
    }, []);

    return (
    <div className='points-page'>
        <BackTop />

        Points
    </div>
  );
};


export default PointsPage;
