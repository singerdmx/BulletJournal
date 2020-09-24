import React, {useEffect} from 'react';
import './punch-card.styles.less';
import {BackTop, Tabs} from "antd";
import {BellOutlined, HeartOutlined} from "@ant-design/icons";
import TemplateEvents from "./punch-card.events.pages";
import TemplateSubscriptions from "./punch-card.subscrptions.pages";

const {TabPane} = Tabs;

type PunchCardProps = {};

const PunchCardPage: React.FC<PunchCardProps> = (props) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Templates';
    }, []);

    return (
        <div className='punch-card-page'>
            <BackTop/>
            <div>
                <Tabs defaultActiveKey="1">
                    <TabPane
                        tab={<span><BellOutlined/>New Events</span>}
                        key="1"
                    >
                        <TemplateEvents/>
                    </TabPane>
                    <TabPane
                        tab={<span><HeartOutlined/>Subscriptions</span>
                        }
                        key="2"
                    >
                        <TemplateSubscriptions/>
                    </TabPane>
                </Tabs>
            </div>
        </div>
    );
};

export default PunchCardPage;
