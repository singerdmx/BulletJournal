import React from 'react';
import { Icon } from 'antd';
import {
  answerNotice,
  updateNotifications
} from '../../features/notification/actions';
import { connect } from 'react-redux';

type actionsProps = {
  actions: string[];
  action: string;
  answerNotice: (action: string, notificationId: number) => void;
  updateNotifications: () => void;
};

class Actions extends React.Component<actionsProps> {
  handleClick(action: string, id: number) {
    const answer = {
      action: action,
      notificationId: id
    };
  }

  render() {
    const { actions } = this.props;
    if (actions.length === 0) {
      return (
        <div className='notification-operation'>
          <Icon
            type='delete'
            theme='twoTone'
            twoToneColor='#ff0000'
            title='Remove'
            style={{ cursor: 'pointer' }}
          />
        </div>
      );
    }
    return (
      <div className='notification-operation'>
        {actions.map(action => {
          let iconType = 'delete';
          let iconColor = '#ff0000';
          switch (action) {
            case 'Accept':
              iconType = 'check-circle';
              iconColor = '#52c41a';
              break;
            case 'Decline':
              iconType = 'close-circle';
              iconColor = '#eb2f96';
              break;
            default:
              console.error('Invalid action ' + action);
          }

          return (
            <Icon
              type={iconType}
              theme='twoTone'
              twoToneColor={iconColor}
              title={action}
              style={{ cursor: 'pointer' }}
            />
          );
        })}
      </div>
    );
  }
}

export default Actions;
