import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Project } from '../../features/project/interface';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { GroupsWithOwner, User } from '../../features/group/interface';
import { Avatar, Divider, Popconfirm, Popover, Tooltip } from 'antd';
import { deleteProject, getProject } from '../../features/project/actions';
import { iconMapper } from '../../components/side-menu/side-menu.component';
import {
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
import { updateExpandedMyself } from '../../features/myself/actions';

import './project.styles.less';
import {
  updateCompletedTasks,
  updateCompletedTaskPageNo,
  getTasksByAssignee,
} from '../../features/tasks/actions';
import { getNotesByOwner, getNotesByOrder } from '../../features/notes/actions';
import { getTransactionsByPayer } from '../../features/transactions/actions';
import TasksByAssignee from '../../components/modals/tasks-by-assignee.component';
import NotesByOwner from '../../components/modals/notes-by-owner.component';
import NotesByOrder from '../../components/modals/notes-by-order.component';
import TransactionsByPayer from '../../components/modals/transactions-by-payer.component';
import ShowProjectHistory from '../../components/modals/show-project-history.component';
import {
  FrequencyType,
  LedgerSummaryType,
} from '../../features/transactions/interface';

type ProjectPathParams = {
  projectId: string;
};

type ModalState = {
  isShow: boolean;
  groupName: string;
  completeTasksShown: boolean;
  tasksByUsersShown: boolean;
  notesByUsersShown: boolean;
  transactionsByUsersShown: boolean;
  assignee: User | undefined;
  notesByOrderShown: boolean;
};

type GroupProps = {
  groups: GroupsWithOwner[];
};

interface ProjectPathProps extends RouteComponentProps<ProjectPathParams> {
  projectId: string;
}

type ProjectPageProps = {
  timezone: string;
  history: History<History.PoorMansUnknown>;
  project: Project | undefined;
  completedTaskPageNo: number;
  transactionTimezone: string;
  transactionFrequencyType: FrequencyType;
  transactionStartDate: string;
  transactionEndDate: string;
  transactionLedgerSummaryType: LedgerSummaryType;
  getProject: (projectId: number) => void;
  deleteProject: (
    projectId: number,
    name: string,
    history: History<History.PoorMansUnknown>
  ) => void;
  updateCompletedTasks: (projectId: number) => void;
  updateCompletedTaskPageNo: (completedTaskPageNo: number) => void;
  getTasksByAssignee: (projectId: number, assignee: string) => void;
  getNotesByOwner: (projectId: number, owner: string) => void;
  getTransactionsByPayer: (
    projectId: number,
    timezone: string,
    ledgerSummaryType: string,
    frequencyType?: string,
    startDate?: string,
    endDate?: string,
    payer?: string
  ) => void;
  getNotesByOrder: (
    projectId: number,
    timezone: string,
    startDate?: string,
    endDate?: string
  ) => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
};

type MyselfProps = {
  myself: string;
  aliases: any;
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
    notesByUsersShown: false,
    transactionsByUsersShown: false,
    notesByOrderShown: false,
    assignee: undefined,
  };

  componentDidMount() {
    this.props.updateExpandedMyself(true);
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
  //by user modal
  handleGetTasksByAssignee = (u: User) => {
    this.setState({ tasksByUsersShown: true });
    this.setState({ assignee: u });
    // update tasks
    this.props.getTasksByAssignee(
      parseInt(this.props.match.params.projectId),
      u.name
    );
  };

  handleGetNotesByOwner = (u: User) => {
    this.setState({ notesByUsersShown: true });
    this.setState({ assignee: u });
    // update tasks
    this.props.getNotesByOwner(
      parseInt(this.props.match.params.projectId),
      u.name
    );
  };
  handleGetTransactionByPayer = (u: User) => {
    const {
      transactionTimezone,
      transactionFrequencyType,
      transactionStartDate,
      transactionEndDate,
      transactionLedgerSummaryType,
    } = this.props;
    this.setState({ transactionsByUsersShown: true });
    this.setState({ assignee: u });
    // update tasks
    this.props.getTransactionsByPayer(
      parseInt(this.props.match.params.projectId),
      transactionTimezone,
      transactionLedgerSummaryType,
      transactionFrequencyType,
      transactionStartDate,
      transactionEndDate,
      u.name
    );
  };

  //by order modal
  handleGetNotesByOrder = () => {
    const { timezone } = this.props;
    this.setState({ notesByOrderShown: true });
    console.log(timezone);
    this.props.getNotesByOrder(
      parseInt(this.props.match.params.projectId),
      timezone,
      undefined,
      undefined
    );
  };

  handleGetProjectItemsByUseCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: this.handleGetNotesByOwner,
    [ProjectType.TODO]: this.handleGetTasksByAssignee,
    [ProjectType.LEDGER]: this.handleGetTransactionByPayer,
  };
  handleGetProjectItemsByOrderCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: this.handleGetNotesByOrder,
    [ProjectType.TODO]: () => {},
    [ProjectType.LEDGER]: () => {},
  };

  render() {
    const { project, myself, history } = this.props;

    if (!project) {
      return null;
    }

    const handleGetProjectItemsByUse = this.handleGetProjectItemsByUseCall[
      project.projectType
    ];
    const handleGetProjectItemsByOrder = this.handleGetProjectItemsByOrderCall[
      project.projectType
    ];
    let createContent = null;
    let projectContent = null;
    let showCompletedTasks = null;
    let projectItemsByUser = null;
    let projectItemsByOrder = null;

    switch (project.projectType) {
      case ProjectType.NOTE:
        createContent = <AddNote mode='icon'/>;
        projectContent = (
          <NoteTree
            readOnly={project.shared}
            showModal={(user: User) => {
              handleGetProjectItemsByUse(user);
            }}
            showOrderModal={() => {
              handleGetProjectItemsByOrder();
            }}
          />
        );
        projectItemsByUser = (
          <NotesByOwner
            owner={this.state.assignee}
            visible={this.state.notesByUsersShown}
            onCancel={() => {
              this.setState({ notesByUsersShown: false });
            }}
          />
        );
        projectItemsByOrder = (
          <NotesByOrder
            visible={this.state.notesByOrderShown}
            onCancel={() => {
              this.setState({ notesByOrderShown: false });
            }}
          />
        );
        break;
      case ProjectType.TODO:
        createContent = <AddTask />;
        projectContent = (
          <TaskTree
            showCompletedTask={this.state.completeTasksShown}
            readOnly={project.shared}
            showModal={(user: User) => {
              handleGetProjectItemsByUse(user);
            }}
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
        projectContent = (
          <TransactionProject
            showModal={(user: User) => {
              handleGetProjectItemsByUse(user);
            }}
          />
        );
        projectItemsByUser = (
          <TransactionsByPayer
            payer={this.state.assignee}
            visible={this.state.transactionsByUsersShown}
            onCancel={() => {
              this.setState({ transactionsByUsersShown: false });
            }}
          />
        );
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
            return <p key={key}>{s}</p>;
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
              &nbsp;{u.alias}
            </p>
          ))}
        </div>
      );
    }

    return (
      <div className='project'>
        <Tooltip
          placement='top'
          title={`${
            this.props.aliases[project.owner]
              ? this.props.aliases[project.owner]
              : project.owner
          }`}
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
            {projectItemsByOrder}
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
  aliases: state.system.aliases,
  transactionTimezone: state.transaction.timezone,
  transactionFrequencyType: state.transaction.frequencyType,
  transactionStartDate: state.transaction.startDate,
  transactionEndDate: state.transaction.endDate,
  transactionLedgerSummaryType: state.transaction.ledgerSummaryType,
  timezone: state.settings.timezone,
});

export default connect(mapStateToProps, {
  getProject,
  deleteProject,
  updateCompletedTasks,
  updateCompletedTaskPageNo,
  getTasksByAssignee,
  getNotesByOwner,
  getTransactionsByPayer,
  getNotesByOrder,
  updateExpandedMyself,
})(ProjectPage);
