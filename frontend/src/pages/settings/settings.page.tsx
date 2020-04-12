import React from 'react';
import { Tabs } from 'antd';
import { Link } from 'react-router-dom';
import Account from '../../components/settings/account';
import {
  GoogleOutlined,
  AppleOutlined,
  WindowsOutlined
} from '@ant-design/icons';
import './setting.style.less';

const { TabPane } = Tabs;

const SettingPage = () => {
  return (
    <div className='setting'>
      <Tabs defaultActiveKey='account'>
        <TabPane tab='Account' key='account'>
          <Account />
        </TabPane>
        <TabPane tab='Calendar Sync' key='calendarSync'>
          <div>
            <Tabs type="card">
              <TabPane tab={<span><GoogleOutlined /> Google Calendar</span>} key="GoogleCalendar">
                <Link to='/api/calender/google/login'>
                  Log in
                </Link>
              </TabPane>
              <TabPane tab={<span><WindowsOutlined /> Outlook Calendar</span>} key="OutlookCalendar">
              </TabPane>
              <TabPane tab={<span><AppleOutlined /> Apple Calendar</span>} key="AppleCalendar">
              </TabPane>
            </Tabs>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default SettingPage;
