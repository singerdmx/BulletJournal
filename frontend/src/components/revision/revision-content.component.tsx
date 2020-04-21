import React, { useEffect, useState } from 'react';
import BraftEditor from 'braft-editor';
import { connect } from 'react-redux';
import { updateNoteContentRevision } from '../../features/notes/actions';
import ReactDiffViewer from 'react-diff-viewer';
import './revision.styles.less';
import { Revision } from '../../features/myBuJo/interface';

type RevisionProps = {
  revisionIndex: number;
  revisions: Revision[];
  curContent: string;
  contentId: number;
  noteId: number;
};

interface RevisionContentHandler {
  updateNoteContentRevision: (
    noteId: number,
    contentId: number,
    revisionId: number
  ) => void;
}

const RevisionContent: React.FC<RevisionProps & RevisionContentHandler> = ({
  revisionIndex,
  revisions,
  curContent,
  contentId,
  noteId,
  updateNoteContentRevision,
}) => {
  const latestContent = BraftEditor.createEditorState(curContent);
  const [history, setHistory] = useState(BraftEditor.createEditorState(''));
  const historyContet = revisions[revisionIndex - 1].content;
  useEffect(() => {
    const historyId = revisions[revisionIndex - 1].id;
    updateNoteContentRevision(noteId, contentId, historyId);
  }, [revisionIndex]);

  useEffect(() => {
    setHistory(
      BraftEditor.createEditorState(revisions[revisionIndex - 1].content)
    );
  }, [historyContet]);

  const highlightSyntax = (str: string) => (
    <div
      dangerouslySetInnerHTML={{
        __html: str,
      }}
    />
  );

  return (
    <div className="revision-container">
      <ReactDiffViewer
        hideLineNumbers
        oldValue={history.toHTML()}
        newValue={latestContent.toHTML()}
        splitView={true}
        renderContent={highlightSyntax}
      />
    </div>
  );
};

export default connect(null, { updateNoteContentRevision })(RevisionContent);
