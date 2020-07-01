import React from 'react';
import {Tabs} from 'antd';
import Account from '../../components/settings/account';
import {GoogleOutlined, DashboardOutlined} from '@ant-design/icons';
import './setting.style.less';
import {useLocation} from "react-use";
import GoogleCalendarSyncPage from "../../components/settings/google-calendar-sync";

const {TabPane} = Tabs;

type SettingProps = {};

const SettingPage: React.FC<SettingProps> = (props) => {
  const location = useLocation();

  const defaultKey = location.hash;
  console.log(defaultKey);
  return (
      <div className='setting'>
        <Tabs defaultActiveKey={defaultKey}>
          <TabPane tab={<span><DashboardOutlined />Account</span>} key='#/settings'>
            <Account/>
          </TabPane>
          <TabPane tab={<span><GoogleOutlined />Sync Google Calendar</span>} key='#/googleCalendar'>
            <div>
              <GoogleCalendarSyncPage/>
            </div>
          </TabPane>
        </Tabs>
      </div>
  );
};

export default SettingPage;
