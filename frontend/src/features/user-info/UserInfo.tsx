import React, { } from 'react';
import { connect } from 'react-redux';
import { Avatar } from 'antd';
import { IState } from '../../store/index';
import { updateUserInfo } from './reducer';

type UserProps = {
    username: string,
    avatar: string,
    updateUserInfo: ()=>void
}



const UserInfo = (props: UserProps) =>{
    console.log(props);
    return (<div
        onClick={()=>props.updateUserInfo()}
        style={{ display: 'flex', width: '100px', justifyContent: 'space-around', alignItems: 'center' }}
      >
        <div>{props.username || 'Log In'}</div>
        <Avatar src={props.avatar} style={{ cursor : 'pointer'}}>{props.username || 'User'}</Avatar>
      </div>)
}

const mapStateToProps = (state: IState) => ({
    username: state.user.username,
    avatar: state.user.avatar
});



export default connect(
    mapStateToProps,
    { updateUserInfo }
)(UserInfo);