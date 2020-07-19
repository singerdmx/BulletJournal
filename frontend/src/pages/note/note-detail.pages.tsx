// page display contents of notes
// react imports
import React, {useEffect} from 'react';
// features
//actions
import { Note } from '../../features/notes/interface';
// components
import NoteContentList from '../../components/content/content-list.component';
// antd imports
import { Avatar, BackTop, Divider, Tooltip } from 'antd';
import './note-page.styles.less';
import 'braft-editor/dist/index.css';
import { ProjectType } from '../../features/project/constants';
import DraggableLabelsList from '../../components/draggable-labels/draggable-label-list.component';
import { Content } from '../../features/myBuJo/interface';
import {inPublicPage} from "../../index";

export type NoteProps = {
  note: Note | undefined;
  contents: Content[];
};

type NoteDetailProps = {
  labelEditable: boolean;
  noteOperation: Function;
  createContentElem: React.ReactNode;
  noteEditorElem: React.ReactNode;
  isPublic?: boolean;
};

const NoteDetailPage: React.FC<NoteProps & NoteDetailProps> = (props) => {
  const {
    note,
    labelEditable,
    noteOperation,
    noteEditorElem,
    createContentElem,
    contents,
    isPublic,
  } = props;
    useEffect(() => {
        if (note) {
            document.title = note.name;
        }
    }, [note]);
  if (!note) return null;
  return (
    <div className={`note-page ${inPublicPage() && 'public'}`}>
      <BackTop />

      <Tooltip
        placement="top"
        title={`${note.owner.alias}`}
        className="note-avatar"
      >
        <span>
          <Avatar size="large" src={note.owner.avatar} />
        </span>
      </Tooltip>

      <div className="note-title">
        <div className="label-and-name">
          {note.name}
          <DraggableLabelsList
            mode={ProjectType.NOTE}
            labels={note.labels}
            editable={labelEditable}
            itemId={note.id}
            itemShared={note.shared}
          />
        </div>

        {noteOperation()}
      </div>
      <Divider />
      <div className="note-content">
        <div className="content-list">
          <NoteContentList projectItem={note} contents={contents} />
        </div>
        {createContentElem}
      </div>
      {noteEditorElem}
    </div>
  );
};

export default NoteDetailPage;
