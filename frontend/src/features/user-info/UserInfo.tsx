import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Dropdown } from 'antd';
import DropdownMenu from '../../components/dropdown-menu/dropdown-menu.component';
import { IState } from '../../store/index';
import { updateUserInfo } from './reducer';

const dropdown = <DropdownMenu />;

type UserProps = {
  username: string;
  avatar: string;
  updateUserInfo: () => void;
};

const UserInfo = (props: UserProps) => {
  console.log(props);
  return (
    <div
      onClick={() => props.updateUserInfo()}
      style={{
        display: 'flex',
        width: '128px',
        justifyContent: 'space-around',
        alignItems: 'center'
      }}
    >
      <div style={{ flexShrink: 2 }}>{props.username || 'Log In'}</div>
      <Dropdown overlay={dropdown} trigger={['click']}>
        <Avatar src={props.avatar} style={{ cursor: 'pointer', flexShrink: 1 }}>
          {props.username || 'User'}
        </Avatar>
      </Dropdown>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  username: state.user.username,
  avatar: state.user.avatar
});

export default connect(mapStateToProps, { updateUserInfo })(UserInfo);
