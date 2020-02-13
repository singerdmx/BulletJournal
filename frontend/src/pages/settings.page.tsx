import React from 'react';
import {Tabs} from 'antd';

import './pages.style.less';

const {TabPane} = Tabs;

const SettingPage = () => {
  return (
    <div className="setting">
      <Tabs defaultActiveKey="account">
        <TabPane tab="Account" key="account">
          Account setting
        </TabPane>
        <TabPane tab="General" key="general">
          Gneral setting
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SettingPage;
