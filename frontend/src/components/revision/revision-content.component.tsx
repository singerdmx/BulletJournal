import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {patchContent as patchNoteContent, updateNoteContentRevision,} from '../../features/notes/actions';
import {patchContent as patchTaskContent, updateTaskContentRevision,} from '../../features/tasks/actions';
import {
  patchContent as patchTransactionContent,
  updateTransactionContentRevision,
} from '../../features/transactions/actions';
// import ReactDiffViewer from 'react-diff-viewer';
import moment from 'moment';
import './revision.styles.less';
import {Content, ProjectItem, Revision,} from '../../features/myBuJo/interface';
import {Avatar, Button, message, Tooltip} from 'antd';
import {EyeInvisibleOutlined, EyeOutlined, RollbackOutlined} from '@ant-design/icons';
import {IState} from '../../store';
import {Project} from '../../features/project/interface';
import {ContentType} from '../../features/myBuJo/constants';
import {createHTML, isContentEditable} from '../content/content-item.component';
import Quill from "quill";
import {getProject} from "../../features/project/actions";
import {getHtmlDiff} from "../../utils/htmldiff/htmldiff";

const Delta = Quill.import('delta');

type RevisionProps = {
  revisionIndex: number;
  revisions: Revision[];
  content: Content;
  targetContent: Content | undefined;
  projectItem: ProjectItem;
  project: Project | undefined;
  myself: string;
};

interface RevisionContentHandler {
  updateNoteContentRevision: (
    noteId: number,
    contentId: number,
    revisionId: number
  ) => void;
  patchNoteContent: (noteId: number, contentId: number, text: string, diff: string) => void;
  updateTaskContentRevision: (
    taskId: number,
    contentId: number,
    revisionId: number
  ) => void;
  patchTaskContent: (taskId: number, contentId: number, text: string, diff: string) => void;
  updateTransactionContentRevision: (
    transactionId: number,
    contentId: number,
    revisionId: number
  ) => void;
  patchTransactionContent: (
    transactionId: number,
    contentId: number,
    text: string,
    diff: string
  ) => void;
  handleClose: () => void;
  getProject: (projectId: number) => void;
}

const RevisionContent: React.FC<RevisionProps & RevisionContentHandler> = ({
  revisionIndex,
  revisions,
  content,
  targetContent,
  projectItem,
  updateNoteContentRevision,
  updateTaskContentRevision,
  updateTransactionContentRevision,
  patchNoteContent,
  patchTaskContent,
  patchTransactionContent,
  handleClose,
  project,
  myself,
  getProject
}) => {
  //reusable update revision function
  const updateContentRevision: { [key in ContentType]: Function } = {
    [ContentType.NOTE]: updateNoteContentRevision,
    [ContentType.TASK]: updateTaskContentRevision,
    [ContentType.TRANSACTION]: updateTransactionContentRevision,
    [ContentType.PROJECT]: () => {},
    [ContentType.GROUP]: () => {},
    [ContentType.LABEL]: () => {},
    [ContentType.CONTENT]: () => {},
    [ContentType.SAMPLE_TASK]: () => {},
  };
  const updateRevisionFunction = updateContentRevision[projectItem.contentType];

  //reusable patch content function
  const patchProjectContent: { [key in ContentType]: Function } = {
    [ContentType.NOTE]: patchNoteContent,
    [ContentType.TASK]: patchTaskContent,
    [ContentType.TRANSACTION]: patchTransactionContent,
    [ContentType.PROJECT]: () => {},
    [ContentType.GROUP]: () => {},
    [ContentType.LABEL]: () => {},
    [ContentType.CONTENT]: () => {},
    [ContentType.SAMPLE_TASK]: () => {},
  };
  const patchContentFunction = patchProjectContent[projectItem.contentType];

  const [history, setHistory] = useState<string | undefined>('');
  const [hideDiff, setHideDiff] = useState(false);

  const historyContent = revisions[revisionIndex - 1].content;

  useEffect(() => {
    const historyId = revisions[revisionIndex - 1].id;
    updateRevisionFunction(projectItem.id, content.id, historyId);
  }, [revisionIndex]);

  useEffect(() => {
    setHistory(
      revisions[revisionIndex - 1].content
    );
  }, [historyContent]);

  useEffect(() => {
    if (!project && projectItem) {
      getProject(projectItem.projectId);
    }
  }, [project]);

  const handleRevert = () => {
    if (!revisions[revisionIndex - 1].content) {
      message.info('Revert Not Work');
      return;
    }
    const newDelta = JSON.parse(revisions[revisionIndex - 1].content!)['delta']
    const oldDelta = JSON.parse(targetContent!.text)['delta'];
    const diff = new Delta(oldDelta).diff(new Delta(newDelta));
    console.log(diff)
    patchContentFunction(
      projectItem.id,
      content.id,
      revisions[revisionIndex - 1].content!,
      JSON.stringify(diff)
    );
    handleClose();
  };

  const getHideDiffButton = () => {
    return (
        <Tooltip title={hideDiff ? 'Show difference' : 'Do not show difference' }>
          <Button
              onClick={() => setHideDiff(!hideDiff)}
              size="small"
              shape="circle"
              type="primary"
              style={{marginRight: '0.5rem'}}
          >
            {hideDiff ? <EyeOutlined /> : <EyeInvisibleOutlined />}
          </Button>
        </Tooltip>
    );
  };

  const getRollbackButton = () => {
    if (project && isContentEditable(project, projectItem, content, myself)) {
      return (
        <Tooltip title="Revert to this version">
          <Button
            onClick={handleRevert}
            size="small"
            shape="circle"
            type="primary"
            style={{ marginRight: '0.5rem' }}
          >
            <RollbackOutlined />
          </Button>
        </Tooltip>
      );
    }

    return null;
  };

  const previousRevisionHtmlBody = history ? createHTML(new Delta(JSON.parse(history)['delta'])) : '<p></p>';
  const currentVersionHtmlBody = createHTML(new Delta(JSON.parse(content.text)['delta']));
  const diff = getHtmlDiff(previousRevisionHtmlBody, currentVersionHtmlBody);
  return (
    <div className="revision-container">
      <div className="revision-content">
        <div className="revision-header">
          <div>
            {getRollbackButton()} Revision {revisionIndex}{' '}
            {revisions[revisionIndex].user.avatar && (
              <Tooltip title={`Edited by ${revisions[revisionIndex].user.alias}`}>
                <Avatar
                  src={revisions[revisionIndex].user.avatar}
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
        <div dangerouslySetInnerHTML={{ __html: previousRevisionHtmlBody }}></div>
      </div>
      <div className="revision-content">
        <div className="revision-header">
          <div>
            {getHideDiffButton()} Current Version{' '}
            <Tooltip title={`Edited by ${content.owner.alias}`}>
              <Avatar
                src={content.owner.avatar}
                style={{ marginRight: '1rem' }}
                size="small"
              />
            </Tooltip>
          </div>
          <span>{moment(content.updatedAt).fromNow()}</span>
        </div>
        <div dangerouslySetInnerHTML={{ __html: hideDiff ? currentVersionHtmlBody : diff}}></div>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  myself: state.myself.username,
  targetContent: state.content.content
});

export default connect(mapStateToProps, {
  updateNoteContentRevision,
  patchNoteContent,
  updateTaskContentRevision,
  patchTaskContent,
  updateTransactionContentRevision,
  patchTransactionContent,
  getProject
})(RevisionContent);
