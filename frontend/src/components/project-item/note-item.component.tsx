import React from 'react';
import {
  DeleteTwoTone,
  FormOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { deleteNote } from '../../features/notes/actions';
import { Note } from '../../features/notes/interface';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import EditNote from '../modals/edit-note.component';

import { Popconfirm, Popover } from 'antd';
import EditProjectItem from '../modals/move-project-item.component';
import ShareProjectItem from '../modals/share-project-item.component';

import './note-item.styles.less';

type NoteProps = {
  note: Note;
  deleteNote: (noteId: number) => void;
};

const ManageNote: React.FC<NoteProps> = props => {
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
  return (
    <div className="note-item">
      <Link to={`/note/${note.id}`}>
        <FormOutlined />
        <span style={{ padding: '0 5px', height: '100%' }}>{note.name}</span>
      </Link>
      <div className="note-control">
        <InfoCircleOutlined />
        <MessageOutlined />
        <Popover
          arrowPointAtCenter
          placement="rightTop"
          overlayStyle={{ width: '150px' }}
          content={<ManageNote note={note} deleteNote={deleteNote} />}
          trigger="click"
        >
          <MoreOutlined />
        </Popover>
      </div>
    </div>
  );
};

export default connect(null, { deleteNote })(NoteItem);
