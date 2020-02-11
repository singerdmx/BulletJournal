import React from 'react';
import { Tabs } from 'antd';

const { TabPane } = Tabs;
const TabsLayout = () => (
    <Tabs defaultActiveKey="account">
        <TabPane key="account" tab="Account"></TabPane>
        <TabPane key="general" tab="Gneral"></TabPane>
    </Tabs>
)

export default TabsLayout;