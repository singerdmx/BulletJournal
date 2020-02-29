import React from 'react';
import { DeleteTwoTone } from '@ant-design/icons';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import { answerNotice } from '../../features/notification/actions';
import { connect } from 'react-redux';
import { ActionType } from '../../features/notification/constants';

type actionsProps = {
  actions: string[];
  type: string;
  notificationId: number;
  answerNotice: (action: string, notificationId: number, type: string) => void;
};

class Actions extends React.Component<actionsProps> {
  handleClick(action: string, id: number, type: string) {
    this.props.answerNotice(action, id, type);
  }

  render() {
    const { actions, notificationId, type } = this.props;
    if (actions.length === 0) {
      return (
        <div className="notification-operation">
          <DeleteTwoTone
            twoToneColor="#ff0000"
            title="Remove"
            style={{ cursor: 'pointer' }}
            onClick={() => this.handleClick('delete', notificationId, type)} />
        </div>
      );
    }
    return (
      <div className="notification-operation">
        {actions.map((action, index) => {
          let iconType = 'delete';
          let iconColor = '#ff0000';
          switch (action) {
            case ActionType.Accept:
              iconType = 'check-circle';
              iconColor = '#52c41a';
              break;
            case ActionType.Decline:
              iconType = 'close-circle';
              iconColor = '#eb2f96';
              break;
            default:
              console.error('Invalid action ' + action);
          }

          return (
            <LegacyIcon
              key={index}
              type={iconType}
              theme="twoTone"
              twoToneColor={iconColor}
              title={action}
              style={{ cursor: 'pointer' }}
              onClick={() => this.handleClick(action, notificationId, type)}
            />
          );
        })}
      </div>
    );
  }
}

export default connect(null, { answerNotice })(Actions);
