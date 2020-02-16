import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateNotifications, Notification } from './reducer';
import { List, Avatar } from 'antd';

type NotificationsProps = {
  notifications: Notification[];
  updateNotifications: () => void;
};

type titleProps = {
  title: String;
  type: String;
};

const ListTitle = ({ title, type }: titleProps) => {
  if (type === 'JoinGroupEvent') {
    const titleList = title.split(' ');
    const name = titleList[0];
    const project = titleList[titleList.length - 1];
    const rest = titleList.slice(1, titleList.length - 1).join(' ');
    return (
      <span>
        <strong>{name}</strong> {rest} <strong>{project}</strong>
      </span>
    );
  }

  return (
      <span>
        title
      </span>
  );
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
              title={<ListTitle title={item.title} type={item.type}/>}
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
