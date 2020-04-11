import React from 'react';
import { Content } from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';
import './note-editor.style.less';

type NoteReaderProps = {
  content: Content;
};

const NoteReader: React.FC<NoteReaderProps> = ({ content }) => {
  const contentState = BraftEditor.createEditorState(content.text);
  const contentDisplay = contentState.toHTML();
  return (
    <div className="content-in-drawer">
      <div dangerouslySetInnerHTML={{ __html: contentDisplay }} />
    </div>
  );
};

export default NoteReader;
