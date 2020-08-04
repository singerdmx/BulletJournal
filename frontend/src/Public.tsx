import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {IState} from './store';
import {connect} from 'react-redux';
import {Note} from './features/notes/interface';
import {Task} from './features/tasks/interface';
import {ContentType} from './features/myBuJo/constants';
import {Content} from './features/myBuJo/interface';
import {getPublicItem} from './features/system/actions';
import {CloseCircleOutlined, UpSquareOutlined} from '@ant-design/icons';

import './styles/main.less';
import './Public.styles.less';
import TaskDetailPage from './pages/task/task-detail.pages';
import NoteDetailPage from './pages/note/note-detail.pages';
import {Tooltip} from 'antd';
import {removeSharedTask} from './features/tasks/actions';
import {removeSharedNote} from './features/notes/actions';
import LabelManagement from './pages/project/label-management.compoent';
import {getRandomBackgroundImage} from './assets/background';
import {inPublicPage} from "./index";

type PageProps = {
  note: Note | undefined;
  task: Task | undefined;
  projectId: number | undefined;
  contentType: ContentType | undefined;
  contents: Content[];
  getPublicItem: (itemId: string) => void;
  removeSharedTask: (taskId: number) => void;
  removeSharedNote: (noteId: number) => void;
};

const PublicPage: React.FC<PageProps> = (props) => {
  const {
    note,
    task,
    contentType,
    contents,
    getPublicItem,
    projectId,
    removeSharedTask,
    removeSharedNote,
  } = props;
  const {itemId} = useParams();
  const history = useHistory();
  const [labelEditable, setLabelEditable] = useState(false);

  useEffect(() => {
    if (itemId) {
      getPublicItem(itemId);
    }
  }, [itemId]);

  if (!contentType) {
    return null;
  }

  const labelEditableHandler = () => {
    setLabelEditable((labelEditable) => !labelEditable);
  };

  const getRemoveButton = (projectId: number) => {
    return (
        <Tooltip title="Remove">
          <div>
            <CloseCircleOutlined
                twoToneColor="#52c41a"
                onClick={() => {
                  switch (contentType) {
                    case ContentType.TASK:
                      removeSharedTask(task!.id);
                      break;
                    case ContentType.NOTE:
                      removeSharedNote(note!.id);
                      break;
                  }
                  history.push(`/projects/${projectId}`);
                }}
            />
          </div>
        </Tooltip>
    );
  };

  const itemOperation = (itemId: string, projectId: number) => {
    if (!itemId.startsWith('TASK') && !itemId.startsWith('NOTE')) {
      return null;
    }
    return (
        <div className="public-item-operation">
          <LabelManagement
              labelEditableHandler={labelEditableHandler}
              labelEditable={labelEditable}
          />
          {getRemoveButton(projectId)}
          <Tooltip title="Go to Parent BuJo">
            <div>
              <UpSquareOutlined
                  onClick={(e) => history.push(`/projects/${projectId}`)}
              />
            </div>
          </Tooltip>
        </div>
    );
  };

  const fullHeight = global.window.innerHeight;

  if (contentType === ContentType.TASK) {
    return (
        <div
            style={inPublicPage() ? {
              backgroundImage: `url(${getRandomBackgroundImage()})`,
              height: `${fullHeight}px`
            } : {}}
            className="public-container"
        >
          <TaskDetailPage
              task={task}
              labelEditable={labelEditable}
              taskOperation={() => itemOperation(itemId!, projectId!)}
              contents={contents}
              createContentElem={null}
              taskEditorElem={null}
              isPublic
          />
        </div>
    );
  }

  if (contentType === ContentType.NOTE) {
    return (
        <div
            style={inPublicPage() ? {
              backgroundImage: `url(${getRandomBackgroundImage()})`,
              height: `${fullHeight}px`
            } : {}}
            className="public-container"
        >
          <NoteDetailPage
              note={note}
              labelEditable={labelEditable}
              createContentElem={null}
              noteOperation={() => itemOperation(itemId!, projectId!)}
              noteEditorElem={null}
              contents={contents}
              isPublic
          />
        </div>
    );
  }

  return null;
};

const mapStateToProps = (state: IState) => ({
  note: state.system.publicNote,
  task: state.system.publicTask,
  projectId: state.system.publicItemProjectId,
  contentType: state.system.contentType,
  contents: state.system.contents,
});

export default connect(mapStateToProps, {
  getPublicItem,
  removeSharedTask,
  removeSharedNote,
})(PublicPage);
