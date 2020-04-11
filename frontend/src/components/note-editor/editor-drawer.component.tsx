import React, { useState } from 'react';

import { Drawer, Button } from 'antd';

import { Content } from '../../features/myBuJo/interface';

import NoteEditor from './note-editor.component';
import NoteReader from './note-reader.component';

type NoteEditorDrawerProps = {
  content?: Content;
  noteId: number;
  visible: boolean;
  onClose: Function;
};

const NoteEditorDrawer: React.FC<NoteEditorDrawerProps> = ({
  content,
  noteId,
  visible,
  onClose,
}) => {
  const [readMode, setReadMode] = useState(true);

  const handleEdit = () => setReadMode(false);
  const handleClose = () => {
    setReadMode(true);
    onClose();
  };
  return (
    <Drawer
      onClose={handleClose}
      visible={visible}
      width="700"
      destroyOnClose
      closable={false}
      footer={readMode && <Button onClick={handleEdit}>Edit</Button>}
    >
      {readMode && content ? (
        <div>
          <NoteReader content={content} />
        </div>
      ) : (
        <NoteEditor
          content={content || undefined}
          noteId={noteId}
          afterFinish={onClose}
        />
      )}
    </Drawer>
  );
};

export default NoteEditorDrawer;
