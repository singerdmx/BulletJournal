import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Notification } from './interface';
import { BellFilled } from '@ant-design/icons';
import { Badge, List, Popover, Result, Tooltip } from 'antd';
import TitleAvatar from '../../components/notification/avatar.compoennt';
import Actions from '../../components/notification/action.component';
import ListTitle from '../../components/notification/list-title.component';
import { updateNotifications } from './actions';

import './notification.styles.less';
import { Link } from 'react-router-dom';

type NotificationsProps = {
  notifications: Notification[];
  updateNotifications: () => void;
};

const getNotification = (item: Notification) => {
  let meta = (
    <List.Item.Meta
        avatar={<TitleAvatar source={item.originator.avatar} type={item.type} originator={item.originator.alias}/>}
      title={
        <ListTitle title={item.title} type={item.type} time={item.timestamp} />
      }
      description={item.content ? item.content : ''}
    />
  );

  if (item.link) {
    meta = <Tooltip title='Click to view'><Link to={item.link}>{meta}</Link></Tooltip>;
  }
  return (
    <List.Item
      extra={
        item.actions && (
          <Actions
            type={item.type}
            actions={item.actions}
            notificationId={item.id}
          ></Actions>
        )
      }
      key={item.id}
    >
      {meta}
    </List.Item>
  );
};

const NotificationList = ({ notifications }: NotificationsProps) => {
  return notifications.length > 0 ? (
    <List
      itemLayout='horizontal'
      dataSource={notifications}
      renderItem={(item) => getNotification(item)}
    />
  ) : (
    <div className='no-data'>
      <Result title='No Notifications' />
    </div>
  );
};

class Notifications extends React.Component<NotificationsProps> {
  componentDidMount() {
    this.props.updateNotifications();
  }

  render() {
    return (
      <Tooltip placement='bottom' title='Notifications'>
        <div className='notifications'>
          <Badge dot={this.props.notifications.length > 0}>
            <Popover
              content={<NotificationList {...this.props} />}
              title='Notifications'
              trigger='click'
              arrowPointAtCenter
              placement='bottomRight'
              overlayClassName='notifications-list'
            >
              <BellFilled style={{ fontSize: '20px' }} />
            </Popover>
          </Badge>
        </div>
      </Tooltip>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  notifications: state.notice.notifications,
});

export default connect(mapStateToProps, { updateNotifications })(Notifications);
