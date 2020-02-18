import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateNotifications, Notification } from './reducer';
import { List, Avatar, Badge, Popover, Icon } from 'antd';
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
  switch (type) {
    case 'JoinGroupEvent':
    case 'RemoveUserFromGroupEvent':
    case 'JoinGroupResponseEvent':
      return (
          <div className="notification-title">
            <span>
              <strong>{titleList[0]}</strong> {titleList.slice(1, titleList.length - 1).join(' ')} <strong>{titleList[titleList.length - 1]}</strong>
            </span>
            <span>{moment(time).fromNow()}</span>
          </div>
        );
    case 'DeleteGroupEvent':
      return (
        <div className="notification-title">
            <span>
              {titleList[0]} <strong>{titleList[1]}</strong> {titleList.slice(2, titleList.length).join(' ')}
            </span>
            <span>{moment(time).fromNow()}</span>
        </div>
      );
    default:
        return (
            <div className="notification-title">
                <span>{title}</span>
                <span>{moment(time).fromNow()}</span>
            </div>
        );
  }
};

type titleAvatarProps = {
  source: string;
  type: string;
};

const TitleAvatar = ({ source, type }: titleAvatarProps) => {
  let icon = null;
  switch (type){
    case 'JoinGroupEvent':
      icon =  <Icon type="usergroup-add" />;
      break;
    case 'RemoveUserFromGroupEvent':
      icon =  <Icon type="usergroup-delete" />;
      break;
    case 'DeleteGroupEvent':
      icon = <Icon type="delete" />;
      break;
    case 'JoinGroupResponseEvent':
      icon = <Icon type="info-circle" />;
      break;
    default:
      icon = <Icon type="eye" />;
  }
  return (
    <div className="avatar-title">
      <Badge
        count={icon}
      >
        <Avatar src={source} />
      </Badge>
    </div>
  );
};

type actionsProps = {
  actions: string[];
};

const Actions = ({ actions }: actionsProps) => {
  return actions.length > 0 ? (
    <div className="notification-operation">
      {actions.map(action => {
        switch (action) {
          case 'Accept':
            return <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" title={action}/>;
          case 'Decline':
            return <Icon type="close-circle" theme="twoTone" twoToneColor="#eb2f96" title={action}/>;
          default:
            console.error("Invalid action " + action);
            return <Icon type="delete" theme="twoTone" twoToneColor="#ff0000" title="Remove"/>;
        }
      })}
    </div>
  ) : (
    <div className="notification-operation">
      <Icon type="delete" theme="twoTone" twoToneColor="#ff0000" title="Remove"/>
    </div>
  );
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
