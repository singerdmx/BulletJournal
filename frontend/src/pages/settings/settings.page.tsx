import React from 'react';
import {Tabs} from 'antd';
import Account from '../../components/settings/account';
import {AppleOutlined, GoogleOutlined} from '@ant-design/icons';
import './setting.style.less';
import {useLocation} from "react-use";
import GoogleCalendarSyncPage from "../../components/settings/google-calendar-sync";

const {TabPane} = Tabs;

type SettingProps = {};

const SettingPage: React.FC<SettingProps> = (props) => {
  const location = useLocation();

  let defaultKey = location.hash;
  let calendarKey = '#google';
  if (!defaultKey) {
    defaultKey = 'Account'
  }

  if (defaultKey.substr(0, 1) === '#') {
    calendarKey = defaultKey;
    defaultKey = 'calendarSync';
  }

  return (
      <div className='setting'>
        <Tabs defaultActiveKey={defaultKey}>
          <TabPane tab='Account' key='account'>
            <Account/>
          </TabPane>
          <TabPane tab='Calendar Sync' key='calendarSync'>
            <div>
              <Tabs type="card" defaultActiveKey={calendarKey}>
                <TabPane tab={<span><GoogleOutlined/> Google Calendar</span>} key="#google">
                  <div>
                    <GoogleCalendarSyncPage/>
                  </div>
                </TabPane>
                <TabPane tab={<span><AppleOutlined/> Apple Calendar</span>} key="#apple">
                </TabPane>
              </Tabs>
            </div>
          </TabPane>
        </Tabs>
      </div>
  );
};

export default SettingPage;
