import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateNotifications, Notification } from './reducer';
import { List } from 'antd';

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
      <div className="list">
        <List
          dataSource={this.props.notifications}
          renderItem={item => (
            <List.Item>
              <List.Item.Meta
                avatar={item.originator.avatar}
                title={item.title}
                description={item.content ? item.content : ''}
              />
            </List.Item>
          )}
        />
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  notifications: state.notice.notifications
});

export default connect(mapStateToProps, { updateNotifications })(
  NotificationList
);
