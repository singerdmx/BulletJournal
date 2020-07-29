import React from 'react';

import { BackTop, Drawer } from 'antd';

import { Content, ProjectItem } from '../../features/myBuJo/interface';

import ContentEditor from './content-editor.component';
import ContentReader from './content-reader.component';

type ContentEditorDrawerProps = {
  content?: Content;
  projectItem?: ProjectItem;
  visible: boolean;
  readMode: boolean;
  onClose: Function;
};

interface ContentEditorDrawerHandler {}

const ContentEditorDrawer: React.FC<
  ContentEditorDrawerProps & ContentEditorDrawerHandler
> = ({ content, projectItem, visible, readMode, onClose }) => {
  const handleClose = () => {
    onClose();
  };
  const fullWidth = global.window.innerWidth;
  const drawerWidth =
    fullWidth < 576
      ? fullWidth * 0.9
      : fullWidth < 768
      ? fullWidth * 0.7
      : fullWidth < 992
      ? fullWidth * 0.6
      : fullWidth < 1200
      ? fullWidth * 0.5
      : fullWidth * 0.4;
  if (!projectItem) return null;
  return (
    <Drawer
      placement={'right'}
      onClose={handleClose}
      visible={visible}
      width={drawerWidth}
      destroyOnClose
    >
      {readMode && content ? (
        <div>
          <BackTop />
          <ContentReader content={content} />
        </div>
      ) : (
        <ContentEditor
          content={content || undefined}
          projectItemId={projectItem.id}
          afterFinish={handleClose}
          contentType={projectItem.contentType}
        />
      )}
    </Drawer>
  );
};

export default ContentEditorDrawer;
