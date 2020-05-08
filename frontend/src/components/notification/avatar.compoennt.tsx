import React from 'react';

import {
  ContactsOutlined,
  DeleteOutlined,
  EyeOutlined,
  InfoCircleOutlined,
  PlusSquareOutlined,
  ShareAltOutlined,
  SolutionOutlined,
  StopOutlined,
  TagOutlined,
  UserDeleteOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined
} from '@ant-design/icons';

import {Avatar, Badge} from 'antd';
import {EventType} from '../../features/notification/constants'

type titleAvatarProps = {
  source: string;
  type: string;
};

const TitleAvatar = ({source, type}: titleAvatarProps) => {
  let icon = null;
  switch (type) {
    case EventType.JoinGroupEvent:
      icon = <UsergroupAddOutlined/>;
      break;
    case EventType.RemoveUserFromGroupEvent:
      icon = <UsergroupDeleteOutlined/>;
      break;
    case EventType.DeleteGroupEvent:
    case EventType.RemoveNoteEvent:
    case EventType.RemoveProjectEvent:
    case EventType.RemoveTaskEvent:
    case EventType.RemoveTransactionEvent:
      icon = <DeleteOutlined/>;
      break;
    case EventType.JoinGroupResponseEvent:
      icon = <InfoCircleOutlined/>;
      break;
    case EventType.UpdateTaskAssigneeEvent:
    case EventType.UpdateTransactionPayerEvent:
      icon = <SolutionOutlined/>
      break;
    case EventType.CreateProjectEvent:
      icon = <PlusSquareOutlined/>
      break;
    case EventType.JoinProjectEvent:
      icon = <ContactsOutlined/>
      break;
    case EventType.RemoveFromProjectEvent:
      icon = <UserDeleteOutlined/>
      break;
    case EventType.ShareProjectItemEvent:
      icon = <ShareAltOutlined/>
      break;
    case EventType.SetLabelEvent:
      icon = <TagOutlined/>
      break;
    case EventType.RevokeSharableEvent:
      icon = <StopOutlined/>
      break;
    default:
      icon = <EyeOutlined/>;
  }
  return (
      <div className="avatar-title">
        <Badge
            count={icon}
        >
          <Avatar src={source}/>
        </Badge>
      </div>
  );
};

export default TitleAvatar;