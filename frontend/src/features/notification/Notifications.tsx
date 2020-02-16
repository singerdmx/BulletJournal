import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateNotifications, Notification } from './reducer';
import { List, Avatar } from 'antd';

type NotificationsProps = {
  notifications: Notification[];
  updateNotifications: () => void;
};

class NotificationList extends React.Component<NotificationsProps> {
  componentDidMount() {
    this.props.updateNotifications();
  }

  render() {
    return (
      <List
        itemLayout="horizontal"
        dataSource={this.props.notifications}
        renderItem={item => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={item.originator.avatar} />}
              title={item.title}
              description={item.content ? item.content : 'A new notification'}
            />
          </List.Item>
        )}
      />
    );
  }
}

const mapStateToProps = (state: IState) => ({
  notifications: state.notice.notifications
});

export default connect(mapStateToProps, { updateNotifications })(
  NotificationList
);
