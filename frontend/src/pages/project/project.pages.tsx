import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Project } from '../../features/project/interface';
import { IState } from '../../store';
import { connect } from 'react-redux';
import {GroupsWithOwner, User} from '../../features/group/interface';
import { Avatar, Divider, Popconfirm, Popover, Tooltip } from 'antd';
import { deleteProject, getProject } from '../../features/project/actions';
import { iconMapper } from '../../components/side-menu/side-menu.component';
import {
  HistoryOutlined,
  DeleteOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import EditProject from '../../components/modals/edit-project.component';
import AddNote from '../../components/modals/add-note.component';
import AddTask from '../../components/modals/add-task.component';
import AddTransaction from '../../components/modals/add-transaction.component';
import { ProjectType } from '../../features/project/constants';
import { NoteTree } from '../../components/note-tree';
import { History } from 'history';
import { getGroupByProject } from '../projects/projects.pages';
import TaskTree from './task-tree.component';
import TransactionProject from './transaction-project.pages';

import './project.styles.less';
import {
  updateCompletedTasks,
  updateCompletedTaskPageNo,
  getTasksByAssignee,
} from '../../features/tasks/actions';
import TasksByAssignee from '../../components/modals/tasks-by-assignee.component';
import ShowProjectHistory from "../../components/modals/show-project-history.component";

type ProjectPathParams = {
  projectId: string;
};

type ModalState = {
  isShow: boolean;
  groupName: string;
  completeTasksShown: boolean;
  tasksByUsersShown: boolean;
  assignee: string;
};

type GroupProps = {
  groups: GroupsWithOwner[];
};

interface ProjectPathProps extends RouteComponentProps<ProjectPathParams> {
  projectId: string;
}

type ProjectPageProps = {
  history: History<History.PoorMansUnknown>;
  project: Project | undefined;
  completedTaskPageNo: number;
  getProject: (projectId: number) => void;
  deleteProject: (
    projectId: number,
    name: string,
    history: History<History.PoorMansUnknown>
  ) => void;
  updateCompletedTasks: (projectId: number) => void;
  updateCompletedTaskPageNo: (completedTaskPageNo: number) => void;
  getTasksByAssignee: (projectId: number, assignee: string) => void;
};

type MyselfProps = {
  myself: string;
};

class ProjectPage extends React.Component<
  ProjectPageProps & ProjectPathProps & GroupProps & MyselfProps,
  ModalState
> {
  state: ModalState = {
    isShow: false,
    groupName: '',
    completeTasksShown: false,
    //used for tasks by assignee modal
    tasksByUsersShown: false,
    assignee: '',
  };

  componentDidMount() {
    const projectId = this.props.match.params.projectId;
    this.props.getProject(parseInt(projectId));
    this.setState({ completeTasksShown: false });
  }

  componentDidUpdate(prevProps: ProjectPathProps): void {
    const projectId = this.props.match.params.projectId;
    if (projectId !== prevProps.match.params.projectId) {
      this.props.getProject(parseInt(projectId));
      this.setState({ completeTasksShown: false });
    }
  }

  onClickGroup = (groupId: number) => {
    this.props.history.push(`/groups/group${groupId}`);
  };

  getShowCompletedTasksIcon = () => {
    if (this.state.completeTasksShown) {
      return (
        <Tooltip placement='top' title='Hide Completed Tasks'>
          <div onClick={(e) => this.setState({ completeTasksShown: false })}>
            <CloseCircleOutlined
              style={{ paddingLeft: '0.5em', cursor: 'pointer' }}
            />
          </div>
        </Tooltip>
      );
    }

    return (
      <Tooltip placement='top' title='Show Completed Tasks'>
        <div onClick={this.handleClickShowCompletedTasksButton}>
          <CheckCircleOutlined
            style={{ paddingLeft: '0.5em', cursor: 'pointer' }}
          />
        </div>
      </Tooltip>
    );
  };

  handleClickShowCompletedTasksButton = () => {
    this.setState({ completeTasksShown: true });
    if (this.props.completedTaskPageNo === 0) {
      const projectId = this.props.match.params.projectId;
      this.props.updateCompletedTasks(parseInt(projectId));
    }
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };

  handleGetTasksByAssignee = (u: User) => {
    this.setState({ tasksByUsersShown: true });
    this.setState({ assignee: u.name });
    // update tasks
    this.props.getTasksByAssignee(
      parseInt(this.props.match.params.projectId),
      u.name
    );
  };

  handleGetNotesByOwner = (u: User) => {
  };

  handleGetTransactionByPayer = (u: User) => {
  };

  handleGetProjectItemsByUseCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: this.handleGetNotesByOwner,
    [ProjectType.TODO]: this.handleGetTasksByAssignee,
    [ProjectType.LEDGER]: this.handleGetTransactionByPayer,
  };

  render() {
    const { project, myself, history } = this.props;

    if (!project) {
      return null;
    }

    const handleGetProjectItemsByUse = this.handleGetProjectItemsByUseCall[project.projectType];

    let createContent = null;
    let projectContent = null;
    let showCompletedTasks = null;
    let projectItemsByUser = null;

    switch (project.projectType) {
      case ProjectType.NOTE:
        createContent = <AddNote />;
        projectContent = <NoteTree readOnly={project.shared} />;
        break;
      case ProjectType.TODO:
        createContent = <AddTask />;
        projectContent = (
          <TaskTree
            showCompletedTask={this.state.completeTasksShown}
            readOnly={project.shared}
          />
        );
        showCompletedTasks = this.getShowCompletedTasksIcon();
        projectItemsByUser = (
          <TasksByAssignee
            assignee={this.state.assignee}
            visible={this.state.tasksByUsersShown}
            onCancel={() => {
              this.setState({ tasksByUsersShown: false });
            }}
          />
        );
        break;
      case ProjectType.LEDGER:
        createContent = <AddTransaction />;
        projectContent = <TransactionProject />;
    }

    let editContent = null;
    let deleteContent = null;
    if (project && myself === project.owner) {
      editContent = <EditProject project={project} />;
      deleteContent = (
        <Popconfirm
          title='Deleting BuJo also deletes its child BuJo. Are you sure?'
          okText='Yes'
          cancelText='No'
          onConfirm={() => {
            this.props.deleteProject(project.id, project.name, history);
          }}
          className='group-setting'
          placement='bottom'
        >
          <Tooltip placement='top' title='Delete BuJo'>
            <div className='project-delete'>
              <DeleteOutlined
                style={{ paddingLeft: '0.5em', cursor: 'pointer' }}
              />
            </div>
          </Tooltip>
        </Popconfirm>
      );
    }

    let description = null;
    if (project && project.description) {
      description = (
        <div className='project-description'>
          {project.description.split('\n').map((s, key) => {
            return <p>{s}</p>;
          })}
          <Divider style={{ marginTop: '8px' }} />
        </div>
      );
    }

    const group = getGroupByProject(this.props.groups, project);
    let groupUsers = group ? group.users : [];
    if (project && project.shared) {
      createContent = null;
      showCompletedTasks = null;
      editContent = null;
      deleteContent = null;
      if (groupUsers) {
        groupUsers = groupUsers.filter((u) => u.name === project.owner);
      }
    }

    let popContent = null;
    if (group) {
      popContent = (
        <div>
          {groupUsers.map((u, index) => (
            <p
              key={index}
              className='avatar-container'
              onClick={() => handleGetProjectItemsByUse(u)}
            >
              <Avatar size='small' src={u.avatar} />
              &nbsp;{u.name}
            </p>
          ))}
        </div>
      );
    }

    return (
      <div className='project'>
        <Tooltip
          placement='top'
          title={project.owner}
          className='project-avatar'
        >
          <span>
            <Avatar size='large' src={project.ownerAvatar} />
          </span>
        </Tooltip>
        <div className='project-header'>
          <h2>
            <Tooltip
              placement='top'
              title={`${project.projectType} ${project.name}`}
            >
              <span>
                {iconMapper[project.projectType]}
                &nbsp;{project.name}
              </span>
            </Tooltip>
          </h2>
          <div className='project-control'>
            <Popover
              title={group && group.name}
              placement='bottom'
              content={popContent}
            >
              <span
                style={{ cursor: 'pointer' }}
                onClick={(e) => this.onClickGroup(group.id)}
              >
                <TeamOutlined />
                {group && groupUsers.length}
              </span>
            </Popover>
            {showCompletedTasks}
            <ShowProjectHistory />
            {createContent}
            {editContent}
            {deleteContent}
            {projectItemsByUser}
          </div>
        </div>
        {description && (
          <div className='project-description'>{description}</div>
        )}
        <div className='project-content'>{projectContent}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  groups: state.group.groups,
  myself: state.myself.username,
  completedTaskPageNo: state.task.completedTaskPageNo,
});

export default connect(mapStateToProps, {
  getProject,
  deleteProject,
  updateCompletedTasks,
  updateCompletedTaskPageNo,
  getTasksByAssignee,
})(ProjectPage);
