import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateNotifications, Notification } from './reducer';
import { List, Avatar, Radio, Badge, Popover, Icon } from 'antd';
import moment from 'moment';

import './notification.styles.less';

type NotificationsProps = {
  notifications: Notification[];
  updateNotifications: () => void;
};

type titleProps = {
  title: string;
  type: string;
  time: number;
};

const ListTitle = ({ title, type, time }: titleProps) => {
  const titleList = title.split(' ');
  const name = titleList[0];
  const project = titleList[titleList.length - 1];
  const rest = titleList.slice(1, titleList.length - 1).join(' ');

  return type === 'JoinGroupEvent' ? (
    <div className="notification-title">
      <span>
        <strong>{name}</strong> {rest} <strong>{project}</strong>
      </span>
      <span>{moment(time).fromNow()}</span>
    </div>
  ) : (
    <div className="notification-title">
      <span>{title}</span>
      <span>{moment(time).fromNow()}</span>
    </div>
  );
};

type titleAvatarProps = {
  source: string;
  type: string;
};

const TitleAvatar = ({ source, type }: titleAvatarProps) => {
  return (
    <div className="avatar-title">
      <Badge status={type === 'JoinGroupEvent' ? 'success' : 'processing'} dot>
        <Avatar src={source} />
      </Badge>
    </div>
  );
};

type actionsProps = {
    actions: string[];
}

const Actions = ({actions}: actionsProps) => {
    return actions.length > 0 ? (
            <Radio.Group options={actions}></Radio.Group>
        ):
        (
            <Radio>Mark as Read</Radio>
        );
};

const NotificationList = ({ notifications }: NotificationsProps) => {
  return notifications.length > 0 ? (
    <List
    itemLayout="horizontal"
    dataSource={notifications}
    renderItem={item => (
      <List.Item extra={
          <Actions actions={item.actions}></Actions>
      }>
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
    <div className="no-data">
      No Notifications
    </div>
  )
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
