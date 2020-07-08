import React, {useEffect} from 'react';

import './punch-card.styles.less';
import {BackTop} from "antd";

type PunchCardProps = {
};

const PunchCardPage: React.FC<PunchCardProps> = (props) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Punch Card';
    }, []);

    return (
    <div className='punch-card-page'>
        <BackTop />

        Punch
    </div>
  );
};


export default PunchCardPage;
