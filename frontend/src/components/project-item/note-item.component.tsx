// note item component for note tree
// react import
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
// antd imports
import {
  DeleteTwoTone,
  MoreOutlined,
  FileTextOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { Avatar, Popconfirm, Popover, Tag, Tooltip } from 'antd';
// features import
import { deleteNote } from '../../features/notes/actions';
import { Note } from '../../features/notes/interface';
import { Label, stringToRGB } from '../../features/label/interface';
import { setSelectedLabel } from '../../features/label/actions';
// modals import
import EditNote from '../modals/edit-note.component';
import MoveProjectItem from '../modals/move-project-item.component';
import ShareProjectItem from '../modals/share-project-item.component';
//  third party import
import moment from 'moment';
// assets import
import './project-item.styles.less';
import {ProjectItemUIType, ProjectType} from '../../features/project/constants';
import {
  getIcon,
  getItemIcon,
} from '../draggable-labels/draggable-label-list.component';
import { User } from '../../features/group/interface';

type ProjectProps = {
  readOnly: boolean;
  showModal?: (user: User) => void;
  showOrderModal?: () => void;
};

type NoteProps = {
  inProject: boolean;
  setSelectedLabel: (label: Label) => void;
};

type NoteManageProps = {
  note: Note;
  inModal?: boolean;
  type: ProjectItemUIType;
  deleteNote: (noteId: number, type: ProjectItemUIType) => void;
};

const ManageNote: React.FC<NoteManageProps> = (props) => {
  const { note, deleteNote, inModal, type } = props;

  if (inModal === true) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Popconfirm
          title='Deleting Note also deletes its child notes. Are you sure?'
          okText='Yes'
          cancelText='No'
          onConfirm={() => deleteNote(note.id, type)}
          className='group-setting'
          placement='bottom'
        >
          <div className='popover-control-item'>
            <span>Delete</span>
            <DeleteTwoTone twoToneColor='#f5222d' />
          </div>
        </Popconfirm>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <EditNote note={note} mode='div' />
      <MoveProjectItem
        type={ProjectType.NOTE}
        projectItemId={note.id}
        mode='div'
      />
      <ShareProjectItem
        type={ProjectType.NOTE}
        projectItemId={note.id}
        mode='div'
      />
      <Popconfirm
        title='Deleting Note also deletes its child notes. Are you sure?'
        okText='Yes'
        cancelText='No'
        onConfirm={() => deleteNote(note.id, type)}
        className='group-setting'
        placement='bottom'
      >
        <div className='popover-control-item'>
          <span>Delete</span>
          <DeleteTwoTone twoToneColor='#f5222d' />
        </div>
      </Popconfirm>
    </div>
  );
};

const NoteItem: React.FC<ProjectProps & NoteProps & NoteManageProps> = (
  props
) => {
  // hook history in router
  const history = useHistory();
  // jump to label searching page by label click
  const toLabelSearching = (label: Label) => {
    props.setSelectedLabel(label);
    history.push('/labels/search');
  };

  const {
    note,
    type,
    deleteNote,
    inModal,
    inProject,
    showModal,
    showOrderModal,
    readOnly,
  } = props;

  const getMore = () => {
    if (readOnly) {
      return null;
    }

    return (
      <Popover
        arrowPointAtCenter
        placement='rightTop'
        overlayStyle={{ width: '150px' }}
        content={
          <ManageNote note={note} deleteNote={deleteNote} inModal={inModal} type={type} />
        }
        trigger='click'
      >
        <span className='project-control-more'>
          <MoreOutlined />
        </span>
      </Popover>
    );
  };

  const getAvatar = (user: User) => {
    if (!inProject) return <Avatar src={user.avatar} size='small' />;
    if (!showModal) return <Avatar src={user.avatar} size='small' />;
    return (
      <span
        onClick={() => {
          showModal(user);
        }}
      >
        <Avatar src={user.avatar} size='small' style={{ cursor: 'pointer' }} />
      </span>
    );
  };

  const getOrderIcon = () => {
    if (!inProject) return <FormOutlined />;
    if (!showOrderModal) return <FormOutlined />;
    return (
      <span
        onClick={() => {
          showOrderModal();
        }}
      >
        <FormOutlined />
      </span>
    );
  };

  const handleClick = () => {
    if (props.readOnly) {
      // if readOnly, link to public item page
      history.push(`/public/items/NOTE${note.id}`);
    } else {
      history.push(`/note/${note.id}`);
    }
  };

  return (
    <div className='project-item'>
      <div className='project-item-content'>
        <button onClick={handleClick}>
          <h3 className='project-item-name'>
            {getItemIcon(note, <FileTextOutlined />)}&nbsp;
            {note.name}
          </h3>
        </button>
        <div className='project-item-subs'>
          <div className='project-item-labels'>
            {note.labels &&
              note.labels.map((label) => {
                return (
                  <Tag
                    key={`label${label.id}`}
                    className='labels'
                    onClick={() => toLabelSearching(label)}
                    color={stringToRGB(label.value)}
                    style={{ cursor: 'pointer', borderRadius: 10 }}
                  >
                    <span>
                      {getIcon(label.icon)} &nbsp;
                      {label.value}
                    </span>
                  </Tag>
                );
              })}
          </div>
          <div className='project-item-time'>
            {note.createdAt && `Created ${moment(note.createdAt).fromNow()}`}
          </div>
        </div>
      </div>

      <div className='project-control'>
        <div className='project-item-owner'>
          <Tooltip
            title={note.owner.alias}
          >
            {getAvatar(note.owner)}
          </Tooltip>
        </div>
        <div>
          <Tooltip
            title={
              note.updatedAt && `Updated ${moment(note.updatedAt).fromNow()}`
            }
          >
            {getOrderIcon()}
          </Tooltip>
        </div>
        {getMore()}
      </div>
    </div>
  );
};

export default connect(null, { deleteNote, setSelectedLabel })(
  NoteItem
);
