import React, { useState } from 'react';
import { List, Button, Avatar, Tooltip } from 'antd';
import { Content } from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';
import NoteEditorDrawer from '../note-editor/editor-drawer.component';
import moment from 'moment';
import './content.-item.styles.less';

type NoteContentProps = {
  content: Content;
  noteId: number;
};

const NoteContentItem: React.FC<NoteContentProps> = ({ content, noteId }) => {
  const contentState = BraftEditor.createEditorState(content.text);
  const contentText = contentState.toText();
  const [displayMore, setDisplayMore] = useState(false);
  const createdTime = moment(content.createdAt).fromNow();
  const updateTime = moment(content.updatedAt).format('MMM Do YYYY');
  const handleOpen = () => {
    setDisplayMore(true);
  };

  const handleClose = () => {
    setDisplayMore(false);
  };

  return (
    <List.Item
      key={content.id}
      actions={[
        <Tooltip title={createdTime}>
          <Avatar src={content.ownerAvatar} size="small" />
        </Tooltip>,
        <span>{`Last Update: ${updateTime}`}</span>,
      ]}
    >
      {contentText.length > 300
        ? `${contentText.slice(0, 300)}...`
        : contentText}
      <Button type="link" onClick={handleOpen}>
        Detail
      </Button>
      <NoteEditorDrawer
        content={content}
        visible={displayMore}
        onClose={handleClose}
        noteId={noteId}
      />
    </List.Item>
  );
};

export default NoteContentItem;
