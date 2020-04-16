import React, { useState } from 'react';

import { Drawer, Button } from 'antd';
import { deleteContent } from '../../features/notes/actions';
import { connect } from 'react-redux';

import { Content } from '../../features/myBuJo/interface';

import ContentEditor from './content-editor.component';
import ContentReader from './content-reader.component';

type ContentEditorDrawerProps = {
  content?: Content;
  noteId: number;
  visible: boolean;
  onClose: Function;
};

interface ContentEditorDrawerHandler {
  deleteContent: (noteId: number, contentId: number) => void;
}

const ContentEditorDrawer: React.FC<
  ContentEditorDrawerProps & ContentEditorDrawerHandler
> = ({ content, noteId, visible, onClose, deleteContent }) => {
  const [readMode, setReadMode] = useState(true);
  const handleEdit = () => setReadMode(false);
  const handleDelete = () => {
    if (!content) {
      return;
    }
    deleteContent(noteId, content.id);
  };
  const footerControl = (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button onClick={handleEdit}>Edit</Button>
      <Button danger onClick={handleDelete} style={{ marginLeft: '0.5em' }}>
        Delete
      </Button>
    </div>
  );

  const handleClose = () => {
    setReadMode(true);
    onClose();
  };
  return (
    <Drawer
      onClose={handleClose}
      visible={visible}
      width='700'
      destroyOnClose
      footer={readMode && content && footerControl}
    >
      {readMode && content ? (
        <div>
          <ContentReader content={content} />
        </div>
      ) : (
        <ContentEditor
          content={content || undefined}
          noteId={noteId}
          afterFinish={handleClose}
        />
      )}
    </Drawer>
  );
};

export default connect(null, { deleteContent })(ContentEditorDrawer);
