import React from 'react';

import { Drawer } from 'antd';

import { Content } from '../../features/myBuJo/interface';

import NoteEditor from './note-editor.component';

type NoteEditorDrawerProps = {
  content?: Content;
  noteId: number;
  visible: boolean;
  setVisible: Function;
};

const NoteEditorDrawer: React.FC<NoteEditorDrawerProps> = ({
  content,
  noteId,
  visible,
  setVisible
}) => {
  const afterFinish = () => {
    setVisible(false);
  };
  return (
    <Drawer
      onClose={() => setVisible(false)}
      visible={visible}
      width="500"
      destroyOnClose
      closable={false}
    >
      <NoteEditor
        content={content || undefined}
        noteId={noteId}
        afterFinish={afterFinish}
      />
    </Drawer>
  );
};

export default NoteEditorDrawer;
