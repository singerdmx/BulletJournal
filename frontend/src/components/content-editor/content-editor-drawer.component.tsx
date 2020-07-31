import React from 'react';

import { Drawer } from 'antd';

import { Content, ProjectItem } from '../../features/myBuJo/interface';

import ContentEditor from './content-editor.component';

type ContentEditorDrawerProps = {
  content?: Content;
  projectItem?: ProjectItem;
  visible: boolean;
  onClose: Function;
};

interface ContentEditorDrawerHandler {}

const ContentEditorDrawer: React.FC<
  ContentEditorDrawerProps & ContentEditorDrawerHandler
> = ({ content, projectItem, visible, onClose }) => {
  const handleClose = () => {
    onClose();
  };
  const fullHeight = global.window.innerHeight;
  const fullWidth = global.window.innerWidth;
  const drawerWidth =
    fullWidth > fullHeight ? Math.floor(fullHeight / 1.4) : fullWidth;
  if (!projectItem) return null;
  return (
    <Drawer
      placement={'right'}
      onClose={handleClose}
      visible={visible}
      width={drawerWidth}
      destroyOnClose
    >
      <ContentEditor
        isOpen={visible}
        content={content || undefined}
        projectItemId={projectItem.id}
        afterFinish={handleClose}
        contentType={projectItem.contentType}
      />
    </Drawer>
  );
};

export default ContentEditorDrawer;
