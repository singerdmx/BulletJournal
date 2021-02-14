import React from 'react';

import {
  AlertOutlined,
  ContactsOutlined,
  DeleteOutlined, EditOutlined,
  EyeOutlined,
  InfoCircleOutlined, LinkOutlined,
  PlusSquareOutlined,
  ShareAltOutlined,
  SolutionOutlined,
  StopOutlined,
  TagOutlined,
  UserDeleteOutlined,
  UsergroupAddOutlined,
  UsergroupDeleteOutlined
} from '@ant-design/icons';

import {Avatar, Badge, Tooltip} from 'antd';
import {EventType} from '../../features/notification/constants'

type titleAvatarProps = {
  source: string;
  type: string;
  originator: string;
};

const TitleAvatar = ({source, type, originator}: titleAvatarProps) => {
  let icon = null;
  switch (type) {
    case EventType.JoinGroupEvent:
    case EventType.InviteToJoinGroupEvent:
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
    case EventType.RequestProjectItemWriteAccessResponseEvent:
      icon = <InfoCircleOutlined/>;
      break;
    case EventType.UpdateTaskAssigneeEvent:
    case EventType.UpdateTransactionPayerEvent:
    case EventType.SetTaskStatusEvent:
      icon = <SolutionOutlined/>;
      break;
    case EventType.CreateProjectEvent:
      icon = <PlusSquareOutlined/>;
      break;
    case EventType.RequestProjectItemWriteAccessEvent:
      icon = <EditOutlined />;
      break;
    case EventType.JoinProjectEvent:
      icon = <ContactsOutlined/>;
      break;
    case EventType.RemoveFromProjectEvent:
      icon = <UserDeleteOutlined/>;
      break;
    case EventType.ShareProjectItemEvent:
      icon = <ShareAltOutlined/>;
      break;
    case EventType.SetLabelEvent:
      icon = <TagOutlined/>;
      break;
    case EventType.RevokeSharableEvent:
    case EventType.DisableGroupShareEvent:
      icon = <StopOutlined/>;
      break;
    case EventType.NewSampleTaskEvent:
      icon = <AlertOutlined />;
      break;
    case EventType.ShareGroupEvent:
      icon = <LinkOutlined />;
      break;
    default:
      icon = <EyeOutlined/>;
  }
  return (
      <div className="avatar-title">
        <Badge
            count={icon}
        >
          <Tooltip title={originator} placement={"left"}><Avatar src={source}/></Tooltip>
        </Badge>
      </div>
  );
};

export default TitleAvatar;