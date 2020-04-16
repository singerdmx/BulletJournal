import React, { useState, useEffect } from 'react';

import { Drawer, Button } from 'antd';
import { deleteContent } from '../../features/notes/actions';
import { getProject } from '../../features/project/actions';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Project } from '../../features/project/interface';

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
  deleteContent: (noteId: number, contentId: number) => void;
}

const ContentEditorDrawer: React.FC<
  ContentEditorDrawerProps & ContentEditorDrawerHandler
> = ({
  content,
  projectItem,
  visible,
  onClose,
  deleteContent,
  project,
  myself,
}) => {
  const [readMode, setReadMode] = useState(true);
  const handleEdit = () => setReadMode(false);
  const handleDelete = () => {
    if (!content) {
      return;
    }
    deleteContent(projectItem.id, content.id);
  };

  useEffect(() => {
    getProject(projectItem.projectId);
  }, []);

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
          noteId={projectItem.id}
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

export default connect(mapStateToProps, { deleteContent, getProject })(
  ContentEditorDrawer
);
