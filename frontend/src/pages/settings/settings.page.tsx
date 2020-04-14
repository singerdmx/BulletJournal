import React, {useEffect} from 'react';
import {Button, Tabs, Tooltip} from 'antd';
import {connect} from 'react-redux';
import Account from '../../components/settings/account';
import {loginGoogleCalendar, logoutGoogleCalendar} from '../../apis/calendarApis';
import {googleTokenExpirationTimeUpdate} from "../../features/calendarSync/actions";
import {AppleOutlined, GoogleOutlined, SwapOutlined, ApiOutlined} from '@ant-design/icons';
import './setting.style.less';
import {useLocation} from "react-use";
import {IState} from "../../store";

const {TabPane} = Tabs;

const handleGoogleCalendarLogin = () => {
  loginGoogleCalendar().then(res => {
    window.location.href = res.headers.get('Location')!;
  });
};

const handleGoogleCalendarLogout = () => {
  logoutGoogleCalendar().then(res => {
    window.location.reload();
  });
};

type SettingProps = {
  googleTokenExpirationTime: number;
  googleTokenExpirationTimeUpdate: () => void;
};

const SettingPage: React.FC<SettingProps> = (props) => {
  const location = useLocation();
  const { googleTokenExpirationTime } = props;
  useEffect(() => {
    props.googleTokenExpirationTimeUpdate();
  }, []);

  let defaultKey = location.hash;
  let calendarKey = '#google';
  if (!defaultKey) {
    defaultKey = 'Account'
  }

  if (defaultKey.substr(0, 1) == '#') {
    calendarKey = defaultKey;
    defaultKey = 'calendarSync';
  }

  const getGoogleLoginStatus = () => {
    if (googleTokenExpirationTime) {
      return <Tooltip title='Log out Google Account'>
        <Button onClick={() => handleGoogleCalendarLogout()}><ApiOutlined /><span>{' '}Disconnect</span></Button>
      </Tooltip>;
    }

    return <Tooltip title='Enjoy a 2-way sync between your scheduled tasks and your Google Calendar'>
      <Button onClick={() => handleGoogleCalendarLogin()}><SwapOutlined/><span>{' '}Connect</span></Button>
    </Tooltip>;
  };
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
                    {getGoogleLoginStatus()}
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

const mapStateToProps = (state: IState) => ({
  googleTokenExpirationTime: state.calendarSync.googleTokenExpirationTime
});

export default connect(mapStateToProps, {googleTokenExpirationTimeUpdate})(SettingPage);
