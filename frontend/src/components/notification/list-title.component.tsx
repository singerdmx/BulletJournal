import React from 'react';
import moment from 'moment';

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

  export default ListTitle;