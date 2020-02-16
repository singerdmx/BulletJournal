import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Dropdown, Icon, Popover } from 'antd';
import DropdownMenu from '../../components/dropdown-menu/dropdown-menu.component';
import NotificationList from '../notification/Notifications';
import { IState } from '../../store/index';
import { updateUserInfo } from './reducer';

import './user-info.styles.less';

type UserProps = {
  username: string;
  avatar: string;
  updateUserInfo: () => void;
};

class UserInfo extends React.Component<UserProps> {
  componentDidMount() {
    this.props.updateUserInfo();
  }
  render() {
    // console.log(this.props)

    const dropdown = <DropdownMenu />;
    const notifications = <NotificationList />
    return (
      <div
        style={{
          display: 'flex',
          width: '200px',
          justifyContent: 'space-around',
          alignItems: 'center',
          fontSize: '20px',
          color: 'white'
        }}
      >
      <div style={{ flexShrink: 2 }}>{this.props.username || 'Log In'}</div>
        <Popover content={notifications} trigger='click' placement="bottomRight" overlayClassName="notifications">
          <Icon type="bell" theme="filled" />
        </Popover>
        <Dropdown overlay={dropdown} trigger={['click']}>
          <Avatar
            src={this.props.avatar}
            style={{ cursor: 'pointer', flexShrink: 1 }}
            size={28}
          >
            {this.props.username || 'User'}
          </Avatar>
        </Dropdown>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  username: state.user.username,
  avatar: state.user.avatar
});

export default connect(mapStateToProps, { updateUserInfo })(UserInfo);
