import React, { useState, useEffect } from 'react';

import { Drawer, Button } from 'antd';
import { deleteContent as deleteNoteContent } from '../../features/notes/actions';
import { deleteContent as deleteTaskContent } from '../../features/tasks/actions';
import { deleteContent as deleteTransactionContent } from '../../features/transactions/actions';
import { getProject } from '../../features/project/actions';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Project } from '../../features/project/interface';
import { ContentType } from '../../features/myBuJo/constants';

import { Content, ProjectItem } from '../../features/myBuJo/interface';

import ContentEditor from './content-editor.component';
import ContentReader from './content-reader.component';

type ContentEditorDrawerProps = {
  content?: Content;
  projectItem: ProjectItem;
  visible: boolean;
  onClose: Function;
  project: Project;
  myself: string;
};

interface ContentEditorDrawerHandler {
  getProject: (projectId: number) => void;
  deleteNoteContent: (noteId: number, contentId: number) => void;
  deleteTaskContent: (taskId: number, contentId: number) => void;
  deleteTransactionContent: (transactionId: number, contentId: number) => void;
}

const ContentEditorDrawer: React.FC<
  ContentEditorDrawerProps & ContentEditorDrawerHandler
> = ({
  content,
  projectItem,
  visible,
  onClose,
  deleteNoteContent,
  deleteTaskContent,
  deleteTransactionContent,
  project,
  myself,
}) => {
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
  const [readMode, setReadMode] = useState(true);
  const handleEdit = () => setReadMode(false);
  const handleDelete = () => {
    if (!content) {
      return;
    }
    deleteContentFunction(projectItem.id, content.id);
  };

  const footerControl = (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      <Button onClick={handleEdit}>Edit</Button>
      <Button danger onClick={handleDelete} style={{ marginLeft: '0.5em' }}>
        Delete
      </Button>
    </div>
  );

  const getFooterControl = () => {
    if (
      project.owner === myself ||
      projectItem.owner === myself ||
      (content && content.owner === myself)
    ) {
      return footerControl;
    }

    return null;
  };

  const handleClose = () => {
    setReadMode(true);
    onClose();
  };
  return (
    <Drawer
      onClose={handleClose}
      visible={visible}
      width='700'
      destroyOnClose
      footer={readMode && content && getFooterControl()}
    >
      {readMode && content ? (
        <div>
          <ContentReader content={content} />
        </div>
      ) : (
        <ContentEditor
          content={content || undefined}
          projectItemId={projectItem.id}
          afterFinish={handleClose}
        />
      )}
    </Drawer>
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
})(ContentEditorDrawer);
