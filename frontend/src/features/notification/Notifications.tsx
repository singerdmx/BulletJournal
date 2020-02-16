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
    render() {
        console.log(this.props);
        return (<div onClick={()=>this.props.updateNotifications()}>name</div>)
    }
};

const mapStateToProps = (state: IState) => ({
    notifications: state.notice.notifications
});

export default connect(mapStateToProps, { updateNotifications })(NotificationList);