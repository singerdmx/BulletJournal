import React from 'react';
import {Avatar, Badge, Button, Collapse, Empty, message, Tag, Tooltip} from 'antd';
import moment from 'moment';
import {DeleteOutlined, LinkOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {revokeTaskSharable} from '../../features/tasks/actions';
import {revokeNoteSharable} from '../../features/notes/actions';
import {ProjectType} from '../../features/project/constants';
import {IState} from '../../store';
import {User} from '../../features/group/interface';
import {SharableLink} from '../../features/system/interface';
import CopyToClipboard from 'react-copy-to-clipboard';

const { Panel } = Collapse;

type ProjectItemProps = {
  type: ProjectType;
  projectItemId: number;
  taskSharedUsers: User[];
  taskSharedLinks: SharableLink[];
  noteSharedUsers: User[];
  noteSharedLinks: SharableLink[];
  revokeTaskSharable: (taskId: number, user?: string, link?: string) => void;
  revokeNoteSharable: (noteId: number, user?: string, link?: string) => void;
};

const ShareProjectItemManagement: React.FC<ProjectItemProps> = (props) => {
  const getSharedUsers: { [key in ProjectType]: User[] } = {
    [ProjectType.NOTE]: props.noteSharedUsers,
    [ProjectType.TODO]: props.taskSharedUsers,
    [ProjectType.LEDGER]: [],
  };

  const getSharedLinks: { [key in ProjectType]: SharableLink[] } = {
    [ProjectType.NOTE]: props.noteSharedLinks,
    [ProjectType.TODO]: props.taskSharedLinks,
    [ProjectType.LEDGER]: [],
  };

  const revokeShareableCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: props.revokeNoteSharable,
    [ProjectType.TODO]: props.revokeTaskSharable,
    [ProjectType.LEDGER]: () => {},
  };

  const sharedUsers = getSharedUsers[props.type];
  const sharedLinks = getSharedLinks[props.type];
  const revokeShareable = revokeShareableCall[props.type];

  const handleRevokeButtonClick = (id: number, user?: string, link?: string) => {
    revokeShareable(id, user, link);
  };

  const showSharedUsers = () => {
    if (sharedUsers && sharedUsers.length > 0) {
      return sharedUsers.map((u) => (
        <div className="row-item-has-space" key={u.name}>
          <p>
            <Avatar size="small" src={u.avatar} />
            &nbsp;{u.alias}
          </p>
          <Tooltip title="Revoke" placement="right">
            <Button
              type="link"
              icon={<DeleteOutlined />}
              onClick={(e) => handleRevokeButtonClick(props.projectItemId, u.name)}
            />
          </Tooltip>
        </div>
      ));
    }
    return <Empty />;
  };

  const getSharableLink = (link: string) => {
    return `${window.location.origin.toString()}/public/items/${link}`;
  };

  const showSharedLinks = () => {
    if (sharedLinks && sharedLinks.length > 0) {
      return sharedLinks.map((l, index) => (
        <div key={index} className="row-item-has-space">
          <div className="row-item-left">
            <a onClick={() => window.location.href = getSharableLink(l.link)}>
              {' '}
              {getSharableLink(l.link)}{' '}
            </a>
            <Tooltip title="Click to Copy Link">
              <CopyToClipboard
                  text={getSharableLink(l.link)}
                  onCopy={() => message.success('Link copied to clipboard')}
              >
                <LinkOutlined style={{ cursor: 'pointer' }} />
              </CopyToClipboard>
            </Tooltip>
            <div className="sub-tag-list">
              <Tag color="blue">
                {'Created ' + moment(l.createdAt).fromNow()}
              </Tag>
              <Tag color="red">
                {l.expirationTime
                  ? 'Expires ' + moment(l.expirationTime).fromNow()
                  : 'Never Expire'}
              </Tag>
            </div>
          </div>
          <div className="row-item-right">
            <Tooltip title="Revoke" placement="right">
              <Button
                type="link"
                icon={<DeleteOutlined />}
                onClick={(e) => handleRevokeButtonClick(props.projectItemId, undefined, l.link)}
              />
            </Tooltip>
          </div>
        </div>
      ));
    }
    return <Empty />;
  };

  return (
    <div>
      <Collapse defaultActiveKey={['1', '2']}>
        <Panel header={<Badge count={sharedUsers ? sharedUsers.length : 0} style={{backgroundColor: 'grey'}}
                              offset={[20, 6]} title='Count'>
          <span>Shared Users</span>
        </Badge>} key="1">
          {showSharedUsers()}
        </Panel>
        <Panel header={<Badge count={sharedLinks ? sharedLinks.length : 0} style={{backgroundColor: 'grey'}}
                              offset={[20, 6]} title='Count'>
          <span>Shared Links</span>
        </Badge>} key="2">
          {showSharedLinks()}
        </Panel>
      </Collapse>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  taskSharedUsers: state.task.sharedUsers,
  taskSharedLinks: state.task.sharedLinks,
  noteSharedUsers: state.note.sharedUsers,
  noteSharedLinks: state.note.sharedLinks,
});

export default connect(mapStateToProps, {
  revokeTaskSharable,
  revokeNoteSharable,
})(ShareProjectItemManagement);
