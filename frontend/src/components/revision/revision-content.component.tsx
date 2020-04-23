import React, { useEffect, useState } from 'react';
import BraftEditor from 'braft-editor';
import { connect } from 'react-redux';
import {
  updateNoteContentRevision,
  patchContent,
} from '../../features/notes/actions';
// import ReactDiffViewer from 'react-diff-viewer';
import moment from 'moment';
import './revision.styles.less';
import {
  Content,
  ProjectItem,
  Revision,
} from '../../features/myBuJo/interface';
import { Button, message, Avatar } from 'antd';
import { RollbackOutlined } from '@ant-design/icons';
import { Tooltip } from 'antd';

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
  patchContent: (noteId: number, contentId: number, text: string) => void;
  handleClose: () => void;
}

const RevisionContent: React.FC<RevisionProps & RevisionContentHandler> = ({
  revisionIndex,
  revisions,
  content,
  projectItem,
  updateNoteContentRevision,
  patchContent,
  handleClose,
}) => {
  const latestContent = BraftEditor.createEditorState(content.text);
  const [history, setHistory] = useState(BraftEditor.createEditorState(''));
  const historyContent = revisions[revisionIndex - 1].content;

  useEffect(() => {
    console.log('revisionindex2', revisionIndex);
    const historyId = revisions[revisionIndex - 1].id;
    updateNoteContentRevision(projectItem.id, content.id, historyId);
  }, [revisionIndex]);

  useEffect(() => {
    setHistory(
      BraftEditor.createEditorState(revisions[revisionIndex - 1].content)
    );
  }, [historyContent]);

  const handleRevert = () => {
    if (!revisions[revisionIndex - 1].content) {
      message.info('Revert Not Work');
      return;
    }
    patchContent(
      projectItem.id,
      content.id,
      revisions[revisionIndex - 1].content!
    );
    handleClose();
  };

  return (
    <div className="revision-container">
      <div className="revision-content">
        <div className="revision-header">
          <div>
            <Button
              onClick={handleRevert}
              size="small"
              shape="circle"
              type="primary"
              style={{ marginRight: '0.5rem' }}
            >
              <RollbackOutlined />
            </Button>{' '}
            Revision {revisionIndex}{' '}
            {revisions[revisionIndex].userAvatar && (
              <Tooltip title={`Editted by ${revisions[revisionIndex].user}`}>
                <Avatar
                  src={revisions[revisionIndex].userAvatar}
                  style={{ marginRight: '1rem' }}
                  size="small"
                />
              </Tooltip>
            )}
          </div>
          <span>
            {moment(revisions[revisionIndex - 1].createdAt).fromNow()}
          </span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: history.toHTML() }}></div>
      </div>
      <div className="revision-content">
        <div className="revision-header">
          Current version <span>{moment(content.updatedAt).fromNow()}</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: latestContent.toHTML() }}></div>
      </div>
    </div>
  );
};

export default connect(null, { updateNoteContentRevision, patchContent })(
  RevisionContent
);
