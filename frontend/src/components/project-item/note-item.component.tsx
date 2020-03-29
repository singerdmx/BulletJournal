import React from 'react';
import {
  DeleteTwoTone,
  FormOutlined,
  TagOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { deleteNote } from '../../features/notes/actions';
import { Note } from '../../features/notes/interface';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditNote from '../modals/edit-note.component';

import { Popconfirm, Popover, Tag, Tooltip, Avatar } from 'antd';
import EditProjectItem from '../modals/move-project-item.component';
import ShareProjectItem from '../modals/share-project-item.component';

import './note-item.styles.less';
import { stringToRGB, Label } from '../../features/label/interface';
import { icons } from '../../assets/icons';
import { addSelectedLabel } from '../../features/label/actions';

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
      <EditNote note={note} />
      <EditProjectItem type="NOTE" projectItemId={note.id} />
      <ShareProjectItem type="NOTE" projectItemId={note.id} />
      <Popconfirm
        title="Deleting Note also deletes its child notes. Are you sure?"
        okText="Yes"
        cancelText="No"
        onConfirm={() => deleteNote(note.id)}
        className="group-setting"
        placement="bottom"
      >
        <div className="popover-control-item">
          <span>Delete</span>
          <DeleteTwoTone twoToneColor="#f5222d" />
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
    <div className="note-item">
      <div className="note-item-content">
        <Link to={`/note/${note.id}`}>
          <h3 className="note-item-name">
            <Tooltip title={note.owner}>
              <Avatar src={note.ownerAvatar} size="small" shape="square" />
            </Tooltip>{' '}
            {note.name}
          </h3>
        </Link>
        <div className="note-item-subs">
          <div className="note-item-labels">
            {note.labels &&
              note.labels.map(label => {
                return (
                  <Tag className="labels" color={stringToRGB(label.value)}>
                    <span>
                      {getIcon(label.icon)} &nbsp;
                      {label.value}
                    </span>
                  </Tag>
                );
              })}
          </div>
        </div>
      </div>

      <div className="note-control">
        <Popover
          arrowPointAtCenter
          placement="rightTop"
          overlayStyle={{ width: '150px' }}
          content={<ManageNote note={note} deleteNote={deleteNote} />}
          trigger="click"
        >
          <span className="note-control-more">
            <MoreOutlined />
          </span>
        </Popover>
      </div>
    </div>
  );
};

export default connect(null, { deleteNote, addSelectedLabel })(NoteItem);
