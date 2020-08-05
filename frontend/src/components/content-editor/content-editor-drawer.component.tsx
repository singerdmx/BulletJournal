import React from 'react';

import { Drawer } from 'antd';

import { ProjectItem } from '../../features/myBuJo/interface';

import ContentEditor from './content-editor.component';
import {DeltaStatic} from "quill";

type ContentEditorDrawerProps = {
  delta?: DeltaStatic;
  projectItem?: ProjectItem;
  visible: boolean;
  onClose: Function;
};

interface ContentEditorDrawerHandler {}

const ContentEditorDrawer: React.FC<
  ContentEditorDrawerProps & ContentEditorDrawerHandler
> = ({ delta, projectItem, visible, onClose }) => {
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
        delta={delta}
        projectItemId={projectItem.id}
        afterFinish={handleClose}
        contentType={projectItem.contentType}
      />
    </Drawer>
  );
};

export default ContentEditorDrawer;
