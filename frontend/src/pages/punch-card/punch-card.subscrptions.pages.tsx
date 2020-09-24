import React from 'react';
import './punch-card.styles.less';
import {Empty} from "antd";

type TemplateSubscriptionsProps = {};

const TemplateSubscriptions: React.FC<TemplateSubscriptionsProps> = (props) => {
    return (
        <div className='events-card'>
            <Empty/>
        </div>
    );
};

export default TemplateSubscriptions;
