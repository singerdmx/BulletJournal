import React, { useState } from 'react';
import { Drawer, Pagination, Empty } from 'antd';
import RevisionContent from './revision-content.component';
import { Revision } from '../../features/myBuJo/interface';

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
  content: string;
  noteId: number;
  contentId: number;
  onClose: Function;
  revisionDisplay: boolean;
};

const RevisionDrawer: React.FC<RevisionDrawerProps> = ({
  revisions,
  noteId,
  content,
  contentId,
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
          contentId={contentId}
          noteId={noteId}
          revisionIndex={revisionIndex}
          revisions={revisions}
          curContent={content}
        />
      ) : (
        <Empty />
      )}
    </Drawer>
  );
};

export default RevisionDrawer;
