import React from 'react';
import {
  DeleteTwoTone,
  CheckCircleTwoTone,
  CloseCircleTwoTone
} from '@ant-design/icons';
import { answerNotice } from '../../features/notification/actions';
import { connect } from 'react-redux';
import { ActionType } from '../../features/notification/constants';
import {Tooltip} from "antd";

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
          <Tooltip title="Remove">
            <DeleteTwoTone
              twoToneColor="#ff0000"
              style={{ cursor: 'pointer' }}
              onClick={() => this.handleClick('delete', notificationId, type)}
            />
          </Tooltip>
        </div>
      );
    }
    return (
      <div className="notification-operation">
        {actions.map((action, index) => {
          switch (action) {
            case ActionType.Accept:
              return (
                <Tooltip title={action} key={`${action}-${index}`}>
                  <CheckCircleTwoTone
                    twoToneColor="#52c41a"
                    style={{ cursor: 'pointer' }}
                    title={action}
                    onClick={() => this.handleClick(action, notificationId, type)}
                  />
                </Tooltip>
              );
            case ActionType.Decline:
              return (
                <Tooltip title={action} key={`${action}-${index}`}>
                  <CloseCircleTwoTone
                    twoToneColor="#eb2f96"
                    style={{ cursor: 'pointer' }}
                    onClick={() => this.handleClick(action, notificationId, type)}
                  />
                </Tooltip>
              );
            default:
              console.error('Invalid action ' + action);
              return null;
          }
        })}
      </div>
    );
  }
}

export default connect(null, { answerNotice })(Actions);
