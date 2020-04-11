import React, { useState } from 'react';
import { List, Button, Avatar } from 'antd';
import { Content } from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';
import NoteEditorDrawer from '../note-editor/editor-drawer.component';
import { deleteContent } from '../../features/notes/actions';
import { connect } from 'react-redux';

type NoteContentProps = {
  content: Content;
  noteId: number;
};

interface NoteContentHandler {
  deleteContent: (noteId: number, contentId: number) => void;
}

const NoteContentItem: React.FC<NoteContentProps & NoteContentHandler> = ({
  content,
  noteId,
  deleteContent,
}) => {
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

  const handleDelete = (contentId: number) => {
    deleteContent(noteId, contentId);
  };

  return (
    <List.Item
      key={content.id}
      actions={[
        <Button type="link" onClick={startReading}>
          {contentText.length > 300 ? 'Read More' : 'Read'}
        </Button>,
        <Button type="link" onClick={startEdit}>
          Edit
        </Button>,
        <Button type="link" danger onClick={() => handleDelete(content.id)}>
          Delete
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={content.ownerAvatar} />}
        description={
          contentText.length > 300
            ? `${contentText.slice(0, 300)}...`
            : contentText
        }
      />

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

export default connect(null, { deleteContent })(NoteContentItem);
