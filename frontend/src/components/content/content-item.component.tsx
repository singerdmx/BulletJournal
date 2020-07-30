import React, { useState } from 'react';
import { Avatar, List, Tooltip, Tabs, Button, Popover } from 'antd';
import { Content, ProjectItem } from '../../features/myBuJo/interface';
import ContentEditorDrawer from '../content-editor/content-editor-drawer.component';
import RevisionDrawer from '../revision/revision-drawer.component';
import {
  HighlightOutlined,
  DeleteOutlined,
  EditOutlined,
  DashOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import './content-item.styles.less';
import { Project } from '../../features/project/interface';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { ContentType } from '../../features/myBuJo/constants';
import { deleteContent as deleteNoteContent } from '../../features/notes/actions';
import { getProject } from '../../features/project/actions';
import { deleteContent as deleteTaskContent } from '../../features/tasks/actions';
import { deleteContent as deleteTransactionContent } from '../../features/transactions/actions';

type ContentProps = {
  contentEditable?: boolean;
  content: Content;
  projectItem: ProjectItem;
  project: Project | undefined;
  myself: string;
  deleteNoteContent: (noteId: number, contentId: number) => void;
  deleteTaskContent: (taskId: number, contentId: number) => void;
  deleteTransactionContent: (transactionId: number, contentId: number) => void;
  getProject: (projectId: number) => void;
};

export const isContentEditable = (
  project: Project,
  projectItem: ProjectItem,
  content: Content,
  myself: string
) => {
  return (
    project.owner.name === myself ||
    projectItem.owner.name === myself ||
    content.owner.name === myself
  );
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
  getProject,
}) => {
  const contentHtml = JSON.parse(content.text)['###html###'];
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

  return (
    <div className="content-item-page-contianer">
      <div className="content-item-page-control">
        {content.owner.alias}
        <Popover
          placement="bottomRight"
          content={
            <>
              <Tooltip title={'Edit'}>
                <Button onClick={handleEdit} type="link">
                  <EditOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="Delete">
                <Button onClick={handleDelete} type="link">
                  <DeleteOutlined />
                </Button>
              </Tooltip>
              <Tooltip title="View revision history">
                <Button onClick={handleOpenRevisions} type="link">
                  <HighlightOutlined />
                  &nbsp;
                  {content.revisions.length}
                </Button>
              </Tooltip>
            </>
          }
        >
          <DashOutlined style={{ fontWeight: 'bold' }} />
        </Popover>
      </div>
      <div
        className="content-item-page"
        onClick={handleOpen}
        dangerouslySetInnerHTML={{
          __html: contentHtml,
        }}
      />

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
    </div>
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
