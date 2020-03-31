import React from 'react';
import { List } from 'antd';
import { Content } from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';

type NoteContentProps = {
  content: Content;
};

const NoteContentItem: React.FC<NoteContentProps> = ({ content }) => {
  const contentState = BraftEditor.createEditorState(content.text);
  const contentText = contentState.toText();
  return (
    <List.Item key={content.id}>
      {contentText.length > 300
        ? `${contentText.slice(0, 300)}...`
        : contentText}
    </List.Item>
  );
};

export default NoteContentItem;
