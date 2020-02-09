import React from 'react';
import { Avatar } from 'antd';
import { connect } from 'react-redux';
import { IState } from '../store/index';

type UserProps = {
  username: string;
  avatar: string;
};

const UserInfo = (props: UserProps) => {
  // console.log(props);
  return (
    <div
      style={{ display: 'flex', width: '100px', justifyContent: 'space-around', alignItems: 'center' }}
    >
      <div>{props.username || 'Log In'}</div>
      <Avatar src={props.avatar}>{props.username || 'User'}</Avatar>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  username: state.user.username,
  avatar: state.user.avatar
});

export default connect(mapStateToProps)(UserInfo);
