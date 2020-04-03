// note item component for note tree
// react import
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
// antd imports
import {
  DeleteTwoTone,
  TagOutlined,
  MoreOutlined,
  SnippetsOutlined
} from '@ant-design/icons';
import { Popconfirm, Popover, Tag, Tooltip, Avatar } from 'antd';
// features import
import { deleteNote } from '../../features/notes/actions';
import { Note } from '../../features/notes/interface';
import { stringToRGB, Label } from '../../features/label/interface';
import { addSelectedLabel } from '../../features/label/actions';
// modals import
import EditNote from '../modals/edit-note.component';
import MoveProjectItem from '../modals/move-project-item.component';
import ShareProjectItem from '../modals/share-project-item.component';
//  third party import
import moment from 'moment';
// assets import
import { icons } from '../../assets/icons';
import './project-item.styles.less';

type NoteProps = {
  note: Note;
  deleteNote: (noteId: number) => void;
  addSelectedLabel: (label: Label) => void;
};

type NoteManageProps = {
  note: Note;
  deleteNote: (noteId: number) => void;
};

const ManageNote: React.FC<NoteManageProps> = props => {
  const { note, deleteNote } = props;

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <EditNote note={note} mode='div' />
      <MoveProjectItem type='NOTE' projectItemId={note.id} mode='div' />
      <ShareProjectItem type='NOTE' projectItemId={note.id} mode='div' />
      <Popconfirm
        title='Deleting Note also deletes its child notes. Are you sure?'
        okText='Yes'
        cancelText='No'
        onConfirm={() => deleteNote(note.id)}
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

const NoteItem: React.FC<NoteProps> = props => {
  const { note, deleteNote } = props;
  const getIcon = (icon: string) => {
    let res = icons.filter(item => item.name === icon);
    return res.length > 0 ? res[0].icon : <TagOutlined />;
  };

  return (
    <div className='project-item'>
      <div className='project-item-content'>
        <Link to={`/note/${note.id}`}>
          <h3 className='project-item-name'>
            {note.labels && note.labels[0] ? (
              getIcon(note.labels[0].icon)
            ) : (
              <SnippetsOutlined />
            )}
            {note.name}
          </h3>
        </Link>
        <div className='project-item-subs'>
          <div className='project-item-labels'>
            {note.labels &&
              note.labels.map(label => {
                return (
                  <Tag
                    key={`label${label.id}`}
                    className='labels'
                    color={stringToRGB(label.value)}
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
            {note.updatedAt && moment(note.updatedAt).fromNow()}
          </div>
        </div>
      </div>

      <div className='project-control'>
        <div className='project-item-owner'>
          <Tooltip title={note.owner}>
            <Avatar src={note.ownerAvatar} size='small' />
          </Tooltip>
        </div>
        <Popover
          arrowPointAtCenter
          placement='rightTop'
          overlayStyle={{ width: '150px' }}
          content={<ManageNote note={note} deleteNote={deleteNote} />}
          trigger='click'
        >
          <span className='project-control-more'>
            <MoreOutlined />
          </span>
        </Popover>
      </div>
    </div>
  );
};

export default connect(null, { deleteNote, addSelectedLabel })(NoteItem);
