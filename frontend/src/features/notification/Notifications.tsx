import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateNotifications, Notification } from './reducer';
import { List, Avatar, Radio, Badge } from 'antd';
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
  source: string,
  type: string
}

const TitleAvatar = ({source, type}: titleAvatarProps) => {
  return (
    <div className="avatar-title">
      <Badge status={type ==="JoinGroupEvent" ? "success" : "processing"} dot>
        <Avatar src={source} />
      </Badge>
    </div>
  )
}

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
          <List.Item extra={<Radio></Radio>}>
            <List.Item.Meta
              avatar={<TitleAvatar source={item.originator.avatar} type={item.type} />}
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
    );
  }
}

const mapStateToProps = (state: IState) => ({
  notifications: state.notice.notifications
});

export default connect(mapStateToProps, { updateNotifications })(
  NotificationList
);
