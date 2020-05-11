import React from 'react';
import { Content } from '../../features/myBuJo/interface';
import './content-editor.style.less';

type ContentReaderProps = {
  content: Content;
};

const ContentReader: React.FC<ContentReaderProps> = ({ content }) => {
  return (
    <div className="content-in-drawer">
      <div dangerouslySetInnerHTML={{ __html: content.text }} />
    </div>
  );
};

export default ContentReader;
