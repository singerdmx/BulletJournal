import React from 'react';
import {
  DeleteTwoTone,
  DragOutlined,
  EditTwoTone,
  FormOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { deleteNote, moveNote } from '../../features/notes/actions';
import {Note} from "../../features/notes/interface";
import {connect} from "react-redux";

import { Popover } from 'antd';

type NoteProps = {
  note: Note;
  deleteNote: (noteId: number) => void;
  // onEdit: (noteId: number) => void;
  moveNote: (noteId: number, targetProject: number) => void;
};

const Content: React.FC<NoteProps> = props => {
  const { note, deleteNote, moveNote } = props;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <div>
        Delete
        <DeleteTwoTone twoToneColor="#f5222d" onClick={() => deleteNote(note.id)} />
      </div>
      <div>
        Edit <EditTwoTone onClick={() => {}} />
      </div>
      <div>
        Move <DragOutlined onClick={() => moveNote(note.id, 14)} />
      </div>
    </div>
  );
};

const alignConfig = {
  offset: [10, -5]
};

const NoteItem: React.FC<NoteProps> = props => {
  const { note, deleteNote, moveNote } = props;

  return (
    <div
      style={{
        width: '100%',
        height: '2rem',
        position: 'relative',
        lineHeight: '2rem'
      }}
    >
      <FormOutlined />
      <span style={{ padding: '0 5px', height: '100%' }}>{note.name}</span>
      <div
        style={{
          width: '300px',
          height: '100%',
          position: 'absolute',
          top: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <InfoCircleOutlined style={{ marginRight: '1em' }} />
        <MessageOutlined style={{ marginRight: '1em' }} />
        <Popover
          align={alignConfig}
          placement="bottomRight"
          style={{ top: -10 }}
          title={null}
          content={
            <Content
              note={note}
              deleteNote={deleteNote}
              moveNote={moveNote}
            />
          }
          trigger="click"
        >
          <MoreOutlined
            style={{ transform: 'rotate(90deg)', fontSize: '20px' }}
          />
        </Popover>
      </div>
    </div>
  );
};

export default connect(null, {deleteNote, moveNote})(
  NoteItem
);
