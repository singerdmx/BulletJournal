import React, { useState } from 'react';
import { List, Button, Avatar, Tooltip } from 'antd';
import { Content } from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';
import NoteEditorDrawer from '../note-editor/editor-drawer.component';
import moment from 'moment';

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
        <span>{`Last Update: ${updateTime}`}</span>,
        <Button type="link" onClick={handleOpen}>
          Detail
        </Button>,
      ]}
    >
      <List.Item.Meta
        avatar={<Avatar src={content.ownerAvatar} />}
        title={
          <Tooltip title={`Created: ${createdTime}`}>
            <span>Owned by {content.owner}</span>
          </Tooltip>
        }
      />
      {contentText.length > 300
        ? `${contentText.slice(0, 300)}...`
        : contentText}
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
