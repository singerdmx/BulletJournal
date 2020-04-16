// page display contents of notes
// react imports
import React from 'react';
// features
//actions
import { Note } from '../../features/notes/interface';
// components
import NoteContentList from '../../components/content/content-list.component';
// antd imports
import { Avatar, Divider, Tooltip } from 'antd';
import './note-page.styles.less';
import 'braft-editor/dist/index.css';
import { ProjectType } from '../../features/project/constants';
import DraggableLabelsList from '../../components/draggable-labels/draggable-label-list.component';
// modals import

export type NoteProps = {
  note: Note;
};

type NoteDetailProps = {
  labelEditable: boolean;
  noteOperation: Function;
  createContentElem: React.ReactNode;
  noteEditorElem: React.ReactNode;
};

const NoteDetailPage: React.FC<NoteProps & NoteDetailProps> = (props) => {
  const {
    note,
    labelEditable,
    noteOperation,
    noteEditorElem,
    createContentElem,
  } = props;

  return (
    <div className='note-page'>
      <Tooltip placement='top' title={note.owner} className='note-avatar'>
        <span>
          <Avatar size='large' src={note.ownerAvatar} />
        </span>
      </Tooltip>

      <div className='note-title'>
        <div className='label-and-name'>
          {note.name}
          <DraggableLabelsList
            mode={ProjectType.NOTE}
            labels={note.labels}
            editable={labelEditable}
            itemId={note.id}
          />
        </div>

        {noteOperation()}
      </div>
      <Divider />
      <div className='content'>
        <div className='content-list'>
          <NoteContentList projectItem={note} />
        </div>
        {createContentElem}
      </div>
      {noteEditorElem}
    </div>
  );
};

export default NoteDetailPage;
