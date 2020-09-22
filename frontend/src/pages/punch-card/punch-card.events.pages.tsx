import React from 'react';
import './punch-card.styles.less';
import {Empty} from "antd";

type TemplateEventsProps = {};

const TemplateEvents: React.FC<TemplateEventsProps> = (props) => {
    return (
        <div>
            <div className='banner'>
                <a id="templates_pic"
                   href="https://bulletjournal.us/public/templates">
                    <img className="banner-pic"
                         src="https://user-images.githubusercontent.com/122956/93190453-3df4d800-f6f8-11ea-8a66-4074db4adc70.png"
                         alt="Templates"/>
                </a>
            </div>
            <Empty/>
        </div>
    );
};

export default TemplateEvents;
