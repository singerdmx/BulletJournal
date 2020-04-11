import React from 'react';

import { Drawer } from 'antd';

import { Content } from '../../features/myBuJo/interface';

import NoteEditor from './note-editor.component';
import NoteReader from './note-reader.component';

type NoteEditorDrawerProps = {
  content?: Content;
  noteId: number;
  visible: boolean;
  onClose: Function;
  readonly: boolean;
};

const NoteEditorDrawer: React.FC<NoteEditorDrawerProps> = ({
  content,
  noteId,
  visible,
  onClose,
  readonly,
}) => {
  return (
    <Drawer
      onClose={() => onClose()}
      visible={visible}
      width="700"
      destroyOnClose
      closable={false}
    >
      {readonly && content ? (
        <NoteReader content={content} />
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
