import React from 'react';
import { Avatar, Badge, Icon} from 'antd';

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

  export default TitleAvatar;