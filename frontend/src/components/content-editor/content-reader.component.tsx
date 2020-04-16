import React from 'react';
import { Content } from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';
import './content-editor.style.less';

type ContentReaderProps = {
  content: Content;
};

const ContentReader: React.FC<ContentReaderProps> = ({ content }) => {
  const contentState = BraftEditor.createEditorState(content.text);
  const contentDisplay = contentState.toHTML();
  return (
    <div className='content-in-drawer'>
      <div dangerouslySetInnerHTML={{ __html: contentDisplay }} />
    </div>
  );
};

export default ContentReader;
