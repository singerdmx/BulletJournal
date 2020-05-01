import React, {useState} from 'react';
import {Avatar, List, Tooltip} from 'antd';
import {Content, ProjectItem} from '../../features/myBuJo/interface';
import BraftEditor from 'braft-editor';
import ContentEditorDrawer from '../content-editor/content-editor-drawer.component';
import RevisionDrawer from '../revision/revision-drawer.component';
import {HighlightOutlined, ZoomInOutlined, DeleteOutlined, EditOutlined} from '@ant-design/icons';
import moment from 'moment';
import './content-item.styles.less';
import {Project} from "../../features/project/interface";
import {IState} from "../../store";
import {connect} from "react-redux";
import {ContentType} from "../../features/myBuJo/constants";
import {deleteContent as deleteNoteContent} from "../../features/notes/actions";
import {getProject} from "../../features/project/actions";
import {deleteContent as deleteTaskContent} from "../../features/tasks/actions";
import {deleteContent as deleteTransactionContent} from "../../features/transactions/actions";

type ContentProps = {
  contentEditable?: boolean;
  content: Content;
  projectItem: ProjectItem;
  project: Project | undefined;
  myself: string;
  deleteNoteContent: (noteId: number, contentId: number) => void;
  deleteTaskContent: (taskId: number, contentId: number) => void;
  deleteTransactionContent: (transactionId: number, contentId: number) => void;
};

export const isContentEditable = (project: Project, projectItem: ProjectItem, content: Content, myself: string) => {
  return project.owner === myself ||
      projectItem.owner === myself ||
      (content && content.owner === myself)
};

const ContentItem: React.FC<ContentProps> = ({
  myself,
  project,
  content,
  projectItem,
  contentEditable,
  deleteNoteContent,
  deleteTaskContent,
  deleteTransactionContent,
}) => {
  const contentState = BraftEditor.createEditorState(content.text);
  const contentText = contentState.toText();
  const [displayMore, setDisplayMore] = useState(false);
  const [displayRevision, setDisplayRevision] = useState(false);
  const [readMode, setReadMode] = useState(true);

  const createdTime = content.createdAt
    ? moment(content.createdAt).fromNow()
    : '';
  const updateTime = content.updatedAt
    ? moment(content.updatedAt).format('MMM Do YYYY')
    : '';
  const handleOpen = () => {
    setReadMode(true);
    setDisplayMore(true);
  };
  const handleOpenRevisions = () => {
    setDisplayRevision(true);
  };

  const handleRevisionClose = () => {
    setDisplayRevision(false);
  };

  const handleClose = () => {
    setReadMode(true);
    setDisplayMore(false);
  };

  const deleteContentCall: { [key in ContentType]: Function } = {
    [ContentType.NOTE]: deleteNoteContent,
    [ContentType.TASK]: deleteTaskContent,
    [ContentType.TRANSACTION]: deleteTransactionContent,
    [ContentType.PROJECT]: () => {},
    [ContentType.GROUP]: () => {},
    [ContentType.LABEL]: () => {},
    [ContentType.CONTENT]: () => {},
  };

  let deleteContentFunction = deleteContentCall[projectItem.contentType];
  const handleDelete = () => {
    if (!content) {
      return;
    }
    deleteContentFunction(projectItem.id, content.id);
  };

  const handleEdit = () => {
    setReadMode(false);
    setDisplayMore(true);
  };

  const getActions = () => {
    const actions = [
      <Tooltip title={`Created by ${content.owner} ${createdTime}`}>
        <Avatar src={content.ownerAvatar} size="small" />
      </Tooltip>,
      <Tooltip title="Click to view">
        <ZoomInOutlined onClick={handleOpen} />
      </Tooltip>,
    ];
    if (contentEditable !== false && project && isContentEditable(project, projectItem, content, myself)) {
      actions.push(
          <Tooltip title="Edit">
            <EditOutlined onClick={handleEdit} />
          </Tooltip>
      );
      actions.push(
          <Tooltip title="Delete">
            <DeleteOutlined onClick={handleDelete} />
          </Tooltip>
      );
    }

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
        readMode={readMode}
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

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  myself: state.myself.username,
});

export default connect(mapStateToProps, {
  deleteNoteContent,
  getProject,
  deleteTaskContent,
  deleteTransactionContent,
})(ContentItem);
