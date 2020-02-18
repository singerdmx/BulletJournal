import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateNotifications, Notification } from './reducer';
import { List, Badge, Popover, Icon } from 'antd';
import TitleAvatar from '../../components/notification/avatar.compoennt';
import Actions from '../../components/notification/action.component';
import ListTitle from '../../components/notification/list-title.component';

import './notification.styles.less';

type NotificationsProps = {
  notifications: Notification[];
  updateNotifications: () => void;
};

const NotificationList = ({ notifications }: NotificationsProps) => {
  return notifications.length > 0 ? (
    <List
      itemLayout="horizontal"
      dataSource={notifications}
      renderItem={item => (
        <List.Item extra={<Actions actions={item.actions}></Actions>} key={item.id}>
          <List.Item.Meta
            avatar={
              <TitleAvatar source={item.originator.avatar} type={item.type} />
            }
            title={
              <ListTitle
                title={item.title}
                type={item.type}
                time={item.timestamp}
              />
            }
            description={item.content ? item.content : ''}
          />
        </List.Item>
      )}
    />
  ) : (
    <div className="no-data">No Notifications</div>
  );
};

class Notifications extends React.Component<NotificationsProps> {
  componentDidMount() {
    this.props.updateNotifications();
  }

  render() {
    return (
      <div className="notifications">
        <Badge dot={this.props.notifications.length > 0}>
          <Popover
            content={<NotificationList {...this.props} />}
            title="Notifications"
            trigger="click"
            arrowPointAtCenter
            placement="bottomRight"
            overlayClassName="notifications-list"
          >
            <Icon type="bell" theme="filled" />
          </Popover>
        </Badge>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  notifications: state.notice.notifications
});

export default connect(mapStateToProps, { updateNotifications })(Notifications);
