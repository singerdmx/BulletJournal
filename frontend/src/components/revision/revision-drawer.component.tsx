import React, { useState, useEffect } from "react";
import { Drawer, Pagination } from "antd";
import { connect } from "react-redux";
import { updateNoteContentRevision } from "../../features/notes/actions";
import RevisionCompare from "./revision-compare.component";
import { Revision } from "../../features/myBuJo/interface";

type RevisionDrawerProps = {
  revisions: Revision[];
  noteId: number;
  contentId: number;
  onClose:Function;
  revisionDisplay : boolean;
};

interface RevisionDrawerHandler {
  updateNoteContentRevision: (
    noteId: number,
    contentId: number,
    revisionId: number
  ) => void;
}

const RevisionDrawer: React.FC<RevisionDrawerProps & RevisionDrawerHandler> = ({
  revisions,
  noteId,
  contentId,
  onClose,
  revisionDisplay,
  updateNoteContentRevision,
}) => {
  const [page, setPage] = useState(revisions.length - 1);

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  const handleClose = () => {
      onClose()
  }

  useEffect(() => {
    updateNoteContentRevision(noteId, contentId, revisions[page].id);
  }, []);
  
  return (
    <Drawer
      closable
      onClose={handleClose}
      visible={revisionDisplay}
      footer={
        <Pagination
          current={page}
          onChange={handlePageChange}
          total={revisions.length}
        />
      }
    >
      
    </Drawer>
  );
};

export default connect(null, { updateNoteContentRevision })(RevisionDrawer);
