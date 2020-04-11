import React, { useState } from 'react';
import { List, Button } from 'antd';
import { Content } from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';
import NoteEditorDrawer from '../note-editor/editor-drawer.component';

type NoteContentProps = {
  content: Content;
  noteId: number;
};

const NoteContentItem: React.FC<NoteContentProps> = ({ content, noteId }) => {
  const contentState = BraftEditor.createEditorState(content.text);
  const contentText = contentState.toText();
  const [displayMore, setDisplayMore] = useState(false);
  const [readMode, setReadMode] = useState(true);

  const startReading = () => {
    setDisplayMore(true);
  };

  const handleClose = () => {
    setReadMode(true);
    setDisplayMore(false);
  };

  const startEdit = () => {
    setReadMode(false);
    setDisplayMore(true);
  };

  return (
    <List.Item key={content.id}>
      <List.Item.Meta avatar={content.ownerAvatar} />
      {contentText.length > 300
        ? `${contentText.slice(0, 300)}...`
        : contentText}

      <Button type="link" onClick={startReading}>
        {contentText.length > 300 ? 'Read More' : 'Read'}
      </Button>
      <Button type="link" onClick={startEdit}>
        Edit
      </Button>

      <NoteEditorDrawer
        readonly={readMode}
        content={content}
        visible={displayMore}
        onClose={handleClose}
        noteId={noteId}
      />
    </List.Item>
  );
};

export default NoteContentItem;
