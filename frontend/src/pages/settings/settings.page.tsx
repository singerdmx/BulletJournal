import React from 'react';
import {Tabs, Tooltip} from 'antd';
import Account from '../../components/settings/account';
import {loginGoogleCalendar} from '../../apis/calendarApis';
import {AppleOutlined, GoogleOutlined, SwapOutlined} from '@ant-design/icons';
import './setting.style.less';
import {useLocation} from "react-use";

const {TabPane} = Tabs;

const handleGoogleCalendarLogin = () => {
  loginGoogleCalendar().then(res => {
    window.location.href = res.headers.get('Location')!;
  });
};

type SettingProps = {
};

const SettingPage: React.FC<SettingProps> = (props) => {
  const location = useLocation();
  let defaultKey = location.hash;
  let calendarKey = '#google';
  if (!defaultKey) {
    defaultKey = 'Account'
  }

  if (defaultKey.substr(0, 1) == '#') {
    calendarKey = defaultKey;
    defaultKey = 'calendarSync';
  }

  console.log(calendarKey)
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
                  <div className='calendar-login-button'>
                    <Tooltip title='Enjoy a 2-way sync between your scheduled tasks and your Google Calendar'>
                      <span onClick={() => handleGoogleCalendarLogin()}><SwapOutlined/><span>{' '}Connect</span></span>
                    </Tooltip>
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
