import React from 'react';
import {IState} from '../../store';
import {connect} from 'react-redux';
import {updateNotifications, Notification} from './reducer';

type NotificationsProps = {
    notifications: Notification[]
    updateNotifications: () => void;
}

class NotificationList extends React.Component<NotificationsProps> {
    componentDidMount () {
        this.props.updateNotifications();
    }
}

const mapStateToProps = (state: IState) => ({
    notifications: state
});