import React from 'react';
import { Collapse, Avatar, Empty, Tag, Tooltip, Button, message } from 'antd';
import moment from 'moment';
import { LinkOutlined, DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { revokeTaskSharable } from '../../features/tasks/actions';
import { revokeNoteSharable } from '../../features/notes/actions';
import { ProjectType } from '../../features/project/constants';
import { IState } from '../../store';
import { User } from '../../features/group/interface';
import { SharableLink } from '../../features/system/interface';
import { Link } from 'react-router-dom';
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

  const sharedUsers = getSharedUsers[props.type];
  const sharedLinks = getSharedLinks[props.type];

  const showSharedUsers = () => {
    if (sharedUsers) {
      return sharedUsers.map((u) => (
        <div className="row-item-has-space" key={u.id}>
          <p>
            <Avatar size="small" src={u.avatar} />
            &nbsp;{u.name}
          </p>
          <Tooltip title="Revoke" placement="right">
            <Button type="link" icon={<DeleteOutlined />}></Button>
          </Tooltip>
        </div>
      ));
    }
    return <Empty />;
  };

  const showSharedLinks = () => {
    if (sharedLinks) {
      return sharedLinks.map((l, index) => (
        <div key={index} className="row-item-has-space">
          <div className="row-item-left">
            <Tooltip title="Click to Copy Link">
              <CopyToClipboard
                text={`${window.location.origin.toString()}/public/items/${
                  l.link
                }`}
                onCopy={() => message.success('Link copied to clipboard')}
              >
                <LinkOutlined style={{ cursor: 'pointer' }} />
              </CopyToClipboard>
            </Tooltip>
            <Link title={l.link} to={`/api/public/items/${l.link}`}>
              {' '}
              {`${window.location.origin.toString()}/public/items/${
                l.link
              }`}{' '}
            </Link>
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
              <Button type="link" icon={<DeleteOutlined />}></Button>
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
        <Panel header="Shared Users" key="1">
          {showSharedUsers()}
        </Panel>
        <Panel header="Shared Links" key="2">
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
