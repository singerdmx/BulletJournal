import React, { useState } from 'react';
import { Drawer, Pagination, Empty } from 'antd';
import RevisionContent from './revision-content.component';
import {Content, ProjectItem, Revision} from '../../features/myBuJo/interface';

declare global {
  namespace NodeJS {
    interface Global {
      document: Document;
      window: Window;
      navigator: Navigator;
    }
  }
}
type RevisionDrawerProps = {
  revisions: Revision[];
  content: Content;
  projectItem: ProjectItem;
  onClose: Function;
  revisionDisplay: boolean;
};

const RevisionDrawer: React.FC<RevisionDrawerProps> = ({
  revisions,
  projectItem,
  content,
  onClose,
  revisionDisplay,
}) => {
  const [revisionIndex, setRevisionIndex] = useState(revisions.length - 1);
  const handlePageChange = (page: number) => {
    setRevisionIndex(page);
  };

  const handleClose = () => {
    onClose();
  };
  const fullWidth = global.window.innerWidth;
  return (
    <Drawer
      closable
      onClose={handleClose}
      visible={revisionDisplay}
      destroyOnClose
      width={fullWidth}
      footer={
        <Pagination
          pageSize={1}
          current={revisionIndex}
          onChange={handlePageChange}
          total={revisions.length - 1}
        />
      }
    >
      {revisions.length > 1 ? (
        <RevisionContent
          content={content}
          projectItem={projectItem}
          revisionIndex={revisionIndex}
          revisions={revisions}
        />
      ) : (
        <Empty />
      )}
    </Drawer>
  );
};

export default RevisionDrawer;
