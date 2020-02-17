import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Icon, Popover } from 'antd';
import DropdownMenu from '../../components/dropdown-menu/dropdown-menu.component';
import Notifications from '../notification/Notifications';
import { IState } from '../../store/index';
import { updateUserInfo } from './reducer';

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
    return (
      <div
        style={{
          display: 'flex',
          width: '100px',
          justifyContent: 'space-around',
          alignItems: 'center',
          fontSize: '20px',
          color: 'white'
        }}
      >
        <Icon type="plus" />
        <Notifications />
        <Popover
          content={<DropdownMenu username={this.props.username} />}
          trigger="click"
          placement="bottomRight"
        >
          <Avatar
            src={this.props.avatar}
            style={{ cursor: 'pointer', flexShrink: 1 }}
            size={28}
          >
            {this.props.username || 'User'}
          </Avatar>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  username: state.user.username,
  avatar: state.user.avatar
});

export default connect(mapStateToProps, { updateUserInfo })(UserInfo);
