import React, { useState } from 'react';
import { List, Avatar, Tooltip } from 'antd';
import { Content, ProjectItem } from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';
import ContentEditorDrawer from '../content-editor/content-editor-drawer.component';
import { HighlightOutlined, FullscreenOutlined } from '@ant-design/icons';
import moment from 'moment';
import './content-item.styles.less';

type ContentProps = {
  content: Content;
  projectItem: ProjectItem;
};

const ContentItem: React.FC<ContentProps> = ({ content, projectItem }) => {
  const contentState = BraftEditor.createEditorState(content.text);
  const contentText = contentState.toText();
  const [displayMore, setDisplayMore] = useState(false);
  const createdTime = moment(content.createdAt).fromNow();
  const updateTime = moment(content.updatedAt).format('MMM Do YYYY');
  const handleOpen = () => {
    setDisplayMore(true);
  };
  const handleOpenRevisions = () => {};

  const handleClose = () => {
    setDisplayMore(false);
  };

  const getActions = () => {
    const actions = [
      <Tooltip title='Click to view'>
        <FullscreenOutlined onClick={handleOpen} />
      </Tooltip>,
      <Tooltip title='View revision history'>
        <span className='open-revisions-button' onClick={handleOpenRevisions}>
          <HighlightOutlined />
          &nbsp;
          {content.revisions.length}
        </span>
      </Tooltip>,
      <Tooltip title={`${content.owner} created ${createdTime}`}>
        <Avatar src={content.ownerAvatar} size='small' />
      </Tooltip>,
    ];

    if (content.updatedAt) {
      actions.push(
        <Tooltip title={`Updated ${moment(content.updatedAt).fromNow()}`}>
          <span>{updateTime}</span>
        </Tooltip>
      );
    }

    return actions;
  };

  return (
    <List.Item key={content.id} actions={getActions()}>
      {contentText.length > 300
        ? `${contentText.slice(0, 300)}...`
        : contentText}
      <ContentEditorDrawer
        content={content}
        visible={displayMore}
        onClose={handleClose}
        projectItem={projectItem}
      />
    </List.Item>
  );
};

export default ContentItem;
