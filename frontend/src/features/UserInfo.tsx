import React, { } from 'react';
import { connect } from 'react-redux';
import { IState } from '../store/index';

type UserProps = {
    username: string,
    avatar: string
}


const UserInfo = (props: UserProps) =>{
    // console.log(props);
    return (<div style={{display: 'flex', flexDirection: 'row'}}>
        <div>{props.username || 'username'}</div>
        <div>avatar</div>
    </div>)
}

const mapStateToProps = (state: IState) => ({
    username: state.user.username,
    avatar: state.user.avatar
});



export default connect(
    mapStateToProps
)(UserInfo);