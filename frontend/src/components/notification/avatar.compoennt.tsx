import React from 'react';
import { Avatar, Badge, Icon} from 'antd';
import { EventType } from '../../features/notification/constants'

type titleAvatarProps = {
    source: string;
    type: string;
  };
  
  const TitleAvatar = ({ source, type }: titleAvatarProps) => {
    let icon = null;
    switch (type){
      case EventType.JoinGroupEvent:
        icon =  <Icon type="usergroup-add" />;
        break;
      case EventType.RemoveUserFromGroupEvent:
        icon =  <Icon type="usergroup-delete" />;
        break;
      case EventType.DeleteGroupEvent:
        icon = <Icon type="delete" />;
        break;
      case EventType.JoinGroupResponseEvent:
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

  export default TitleAvatar;