import React, { useState } from 'react';
import { Avatar, List, Tooltip } from 'antd';
import { Content, ProjectItem } from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';
import ContentEditorDrawer from '../content-editor/content-editor-drawer.component';
import RevisionDrawer from '../revision/revision-drawer.component';
import { FullscreenOutlined, HighlightOutlined } from '@ant-design/icons';
import moment from 'moment';
import './content-item.styles.less';

type ContentProps = {
  contentEditable?: boolean;
  content: Content;
  projectItem: ProjectItem;
};

const ContentItem: React.FC<ContentProps> = ({
  content,
  projectItem,
  contentEditable,
}) => {
  const contentState = BraftEditor.createEditorState(content.text);
  const contentText = contentState.toText();
  const [displayMore, setDisplayMore] = useState(false);
  const [displayRevision, setDisplayRevision] = useState(false);
  const createdTime = content.createdAt
    ? moment(content.createdAt).fromNow()
    : '';
  const updateTime = content.updatedAt
    ? moment(content.updatedAt).format('MMM Do YYYY')
    : '';
  const handleOpen = () => {
    setDisplayMore(true);
  };
  const handleOpenRevisions = () => {
    setDisplayRevision(true);
  };

  const handleRevisionClose = () => {
    setDisplayRevision(false);
  };

  const handleClose = () => {
    setDisplayMore(false);
  };

  const getActions = () => {
    const actions = [
      <Tooltip title="Click to view">
        <FullscreenOutlined onClick={handleOpen} />
      </Tooltip>,
    ];
    if (content.revisions && content.revisions.length > 0) {
      actions.push(
        <Tooltip title="View revision history">
          <span className="open-revisions-button" onClick={handleOpenRevisions}>
            <HighlightOutlined />
            &nbsp;
            {content.revisions.length}
          </span>
        </Tooltip>
      );
    }
    actions.push(
      <Tooltip title={`Created by ${content.owner} ${createdTime}`}>
        <Avatar src={content.ownerAvatar} size="small" />
      </Tooltip>
    );

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
        editable={contentEditable}
        content={content}
        visible={displayMore}
        onClose={handleClose}
        projectItem={projectItem}
      />
      <RevisionDrawer
        revisionDisplay={displayRevision}
        onClose={handleRevisionClose}
        revisions={content.revisions}
        projectItem={projectItem}
        content={content}
      />
    </List.Item>
  );
};

export default ContentItem;
