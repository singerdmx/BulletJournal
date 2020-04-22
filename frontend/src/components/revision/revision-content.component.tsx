import React, { useEffect, useState } from 'react';
import BraftEditor from 'braft-editor';
import { connect } from 'react-redux';
import { updateNoteContentRevision } from '../../features/notes/actions';
import ReactDiffViewer from 'react-diff-viewer';
import './revision.styles.less';
import {Content, ProjectItem, Revision} from '../../features/myBuJo/interface';

type RevisionProps = {
  revisionIndex: number;
  revisions: Revision[];
  content: Content;
  projectItem: ProjectItem;
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
  content,
  projectItem,
  updateNoteContentRevision,
}) => {
  const latestContent = BraftEditor.createEditorState(content.text);
  const [history, setHistory] = useState(BraftEditor.createEditorState(''));
  const historyContent = revisions[revisionIndex - 1].content;
  useEffect(() => {
    const historyId = revisions[revisionIndex - 1].id;
    updateNoteContentRevision(projectItem.id, content.id, historyId);
  }, [revisionIndex]);

  useEffect(() => {
    setHistory(
      BraftEditor.createEditorState(revisions[revisionIndex - 1].content)
    );
  }, [historyContent]);

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
