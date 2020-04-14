import React from 'react';
import { Tabs } from 'antd';
import Account from '../../components/settings/account';
import { loginGoogleCalendar } from '../../apis/calendarApis';
import {
  GoogleOutlined,
  AppleOutlined,
  SwapOutlined
} from '@ant-design/icons';
import './setting.style.less';

const { TabPane } = Tabs;

const handleGoogleCalendarLogin = () => {
  loginGoogleCalendar().then(res => {
    window.location.href = res.headers.get('Location')!;
  });
};

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
                <div className='calendar-login-button' onClick={() => handleGoogleCalendarLogin()}>
                  <SwapOutlined /><span>{' '}Connect</span>
                </div>
                Enjoy a 2-way sync between your scheduled tasks and your Google Calendar.
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
