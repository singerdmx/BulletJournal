import React from 'react';
import { Content } from '../../features/myBuJo/interface';
import './content-editor.style.less';
import { ConvertQuillDeltaToHtml } from '../revision/revision-content.component';

type ContentReaderProps = {
  content: Content;
};

const ContentReader: React.FC<ContentReaderProps> = ({ content }) => {
  return (
    <div className="content-in-drawer">
      <div dangerouslySetInnerHTML={{ __html: ConvertQuillDeltaToHtml(JSON.parse(content.text).ops) }} />
    </div>
  );
};

export default ContentReader;
