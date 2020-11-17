// page display contents of tasks
// react imports
import React, {useEffect, useState} from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
// features
//actions
import {
  completeTask, deleteContent,
  deleteTask,
  getTask,
  updateTaskContents,
} from '../../features/tasks/actions';
import { IState } from '../../store';
// antd imports
import { Avatar, Badge, Popconfirm, Popover, Tooltip } from 'antd';
import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  SyncOutlined,
  UpSquareOutlined,
  TeamOutlined,
  PlusOutlined,
} from '@ant-design/icons';
// modals import
import EditTask from '../../components/modals/edit-task.component';
import MoveProjectItem from '../../components/modals/move-project-item.component';
import ShareProjectItem from '../../components/modals/share-project-item.component';

import './task-page.styles.less';
import 'braft-editor/dist/index.css';
import {
  ProjectItemUIType,
  ProjectType,
} from '../../features/project/constants';
// components
import TaskDetailPage, { TaskProps } from './task-detail.pages';
import ContentEditorDrawer from '../../components/content-editor/content-editor-drawer.component';
import LabelManagement from '../project/label-management.compoent';
import {
  Container,
  Button as FloatButton,
  lightColors,
  darkColors,
} from 'react-floating-action-button';
import { getTaskAssigneesPopoverContent } from '../../components/project-item/task-item.component';
import {setDisplayMore, setDisplayRevision} from "../../features/content/actions";
import {Content} from "../../features/myBuJo/interface";
import {DeleteOutlined, EditOutlined, HighlightOutlined} from "@ant-design/icons/lib";
import {getProject} from "../../features/project/actions";
import {Project} from "../../features/project/interface";
import {contentEditable} from "../note/note.pages";

interface TaskPageHandler {
  myself: string;
  project: Project | undefined;
  content: Content | undefined;
  getTask: (taskId: number) => void;
  deleteTask: (taskId: number, type: ProjectItemUIType) => void;
  updateTaskContents: (taskId: number, updateDisplayMore?: boolean) => void;
  completeTask: (
    taskId: number,
    type: ProjectItemUIType,
    dateTime?: string
  ) => void;
  setDisplayMore: (displayMore: boolean) => void;
  setDisplayRevision: (displayRevision: boolean) => void;
  deleteContent: (taskId: number, contentId: number) => void;
  getProject: (projectId: number) => void;
}

const TaskPage: React.FC<TaskPageHandler & TaskProps> = (props) => {
  const {
    myself,
    project,
    content,
    task,
    deleteTask,
    updateTaskContents,
    getTask,
    contents,
    completeTask,
    setDisplayMore,
    setDisplayRevision,
    deleteContent,
    getProject
  } = props;
  // get id of task from router
  const { taskId } = useParams();
  // state control drawer displaying
  const [showEditor, setEditorShow] = useState(false);
  const [labelEditable, setLabelEditable] = useState(false);
  // hook history in router
  const history = useHistory();

  // listening on the empty state working as componentDidmount
  useEffect(() => {
    taskId && getTask(parseInt(taskId));
  }, [taskId]);

  useEffect(() => {
    if (!task) {
      return;
    }
    updateTaskContents(task.id);
    setDisplayMore(false);
    setDisplayRevision(false);
    getProject(task.projectId);
  }, [task]);

  if (!task) return null;
  // show drawer
  const createHandler = () => {
    setEditorShow(true);
  };

  const handleClose = () => {
    setEditorShow(false);
  };

  const labelEditableHandler = () => {
    setLabelEditable((labelEditable) => !labelEditable);
  };

  const handleRefresh = () => {
    task && task.id && updateTaskContents(task.id);
    taskId && getTask(parseInt(taskId));
  };

  const handleEdit = () => {
    task && task.id && updateTaskContents(task.id, true);
  };

  const handleOpenRevisions = () => {
    setDisplayRevision(true);
  };

  const handleDelete = () => {
    if (!content) {
      return;
    }
    deleteContent(task.id, content.id);
  };


  const createContentElem = (
      <Container>
        <FloatButton
            tooltip="Go to Parent BuJo"
            onClick={() => history.push(`/projects/${task.projectId}`)}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <UpSquareOutlined/>
        </FloatButton>
        <FloatButton
            tooltip="Refresh Contents"
            onClick={handleRefresh}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <SyncOutlined/>
        </FloatButton>
        {contentEditable(myself, content, task, project) && <FloatButton
            tooltip="Delete Content"
            onClick={handleDelete}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <DeleteOutlined/>
        </FloatButton>}
        {content && content.revisions.length > 1 && contentEditable(myself, content, task, project) && <FloatButton
            tooltip={`View Revision History (${content.revisions.length - 1})`}
            onClick={handleOpenRevisions}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <HighlightOutlined/>
        </FloatButton>}
        {contentEditable(myself, content, task, project) && <FloatButton
            tooltip="Edit Content"
            onClick={handleEdit}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <EditOutlined/>
        </FloatButton>}
        <FloatButton
            tooltip="Add Content"
            onClick={createHandler}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <PlusOutlined/>
        </FloatButton>
      </Container>

  );

  const taskEditorElem = (
    <div className="task-drawer">
      <ContentEditorDrawer
        projectItem={task}
        visible={showEditor}
        onClose={handleClose}
      />
    </div>
  );

  const getAssignees = () => {
    if (!task.assignees || task.assignees.length === 0) {
      return null;
    }

    if (task.assignees.length === 1) {
      return (
        <Tooltip title={`Assignee ${task.assignees[0].alias}`}>
          <div className="task-owner">
            <Avatar src={task.assignees[0].avatar} />
          </div>
        </Tooltip>
      );
    }

    return (
      <Popover
        title={`${task.assignees.length} Assignees`}
        placement="bottom"
        content={getTaskAssigneesPopoverContent(task, (u) => (
          <Avatar size="small" src={u.avatar} />
        ))}
      >
        <div className="task-owner">
          <span>
            <Badge
              count={task.assignees.length}
              style={{
                fontSize: '9px',
                color: '#006633',
                backgroundColor: '#e6fff2',
              }}
            >
              <TeamOutlined style={{ fontSize: '21px' }} />
            </Badge>
          </span>
        </div>
      </Popover>
    );
  };

  const handleCompleteTaskClick = () => {
    completeTask(task.id, ProjectItemUIType.PAGE);
    history.push(`/projects/${task.projectId}`);
  };

  const taskOperation = () => {
    return (
      <div className="task-operation">
        {getAssignees()}

        <LabelManagement
          labelEditableHandler={labelEditableHandler}
          labelEditable={labelEditable}
        />
        <MoveProjectItem
          type={ProjectType.TODO}
          projectItemId={task.id}
          mode="icon"
        />
        <ShareProjectItem
          type={ProjectType.TODO}
          projectItemId={task.id}
          mode="icon"
        />
        <EditTask task={task} mode="icon" type={ProjectItemUIType.PAGE}/>
        <Tooltip title="Delete">
          <Popconfirm
            title="Are you sure?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => {
              deleteTask(task.id, ProjectItemUIType.PAGE);
              history.goBack();
            }}
            className="group-setting"
            placement="bottom"
          >
            <div>
              <DeleteTwoTone twoToneColor="#f5222d" />
            </div>
          </Popconfirm>
        </Tooltip>
        <Tooltip title="Complete Task">
          <div>
            <CheckCircleTwoTone
              twoToneColor="#52c41a"
              onClick={() => handleCompleteTaskClick()}
            />
          </div>
        </Tooltip>
      </div>
    );
  };

  return (
    <TaskDetailPage
      task={task}
      labelEditable={labelEditable}
      taskOperation={taskOperation}
      contents={contents}
      createContentElem={createContentElem}
      taskEditorElem={taskEditorElem}
    />
  );
};

const mapStateToProps = (state: IState) => ({
  task: state.task.task,
  contents: state.task.contents,
  content: state.content.content,
  myself: state.myself.username,
  project: state.project.project
});

export default connect(mapStateToProps, {
  deleteTask,
  getTask,
  updateTaskContents,
  completeTask,
  deleteContent,
  setDisplayMore,
  setDisplayRevision,
  getProject
})(TaskPage);
