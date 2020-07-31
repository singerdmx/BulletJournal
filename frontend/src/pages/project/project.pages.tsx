import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Project} from '../../features/project/interface';
import {IState} from '../../store';
import {connect} from 'react-redux';
import {GroupsWithOwner, User} from '../../features/group/interface';
import {Avatar, BackTop, Badge, Collapse, Popconfirm, Popover, Tag, Tooltip,} from 'antd';
import {deleteProject, getProject} from '../../features/project/actions';
import {iconMapper} from '../../components/side-menu/side-menu.component';
import {DeleteOutlined, DownOutlined, SyncOutlined, TeamOutlined, UpOutlined,} from '@ant-design/icons';
import EditProject from '../../components/modals/edit-project.component';
import AddNote from '../../components/modals/add-note.component';
import AddTask from '../../components/modals/add-task.component';
import AddTransaction from '../../components/modals/add-transaction.component';
import {ProjectType} from '../../features/project/constants';
import {NoteTree} from '../../components/note-tree';
import {History} from 'history';
import {getGroupByProject} from '../projects/projects.pages';
import TaskTree from './task-tree.component';
import TransactionProject from './transaction-project.pages';
import {updateExpandedMyself} from '../../features/myself/actions';

import './project.styles.less';
import {getTasksByAssignee, getTasksByOrder,} from '../../features/tasks/actions';
import {getNotesByOrder, getNotesByOwner} from '../../features/notes/actions';
import {getTransactionsByPayer} from '../../features/transactions/actions';
import TasksByAssignee from '../../components/modals/tasks-by-assignee.component';
import TasksByOrder from '../../components/modals/tasks-by-order.component';
import NotesByOwner from '../../components/modals/notes-by-owner.component';
import NotesByOrder from '../../components/modals/notes-by-order.component';
import TransactionsByPayer from '../../components/modals/transactions-by-payer.component';
import ShowProjectHistory from '../../components/modals/show-project-history.component';
import {FrequencyType, LedgerSummaryType,} from '../../features/transactions/interface';
import {projectLabelsUpdate, setSelectedLabel,} from '../../features/label/actions';
import {Label, stringToRGB} from '../../features/label/interface';
import {getIcon} from '../../components/draggable-labels/draggable-label-list.component';
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {MenuOutlined} from "@ant-design/icons/lib";

const { Panel } = Collapse;

type ProjectPathParams = {
  projectId: string;
};

type ModalState = {
  isShow: boolean;
  hideLabel: boolean;
  groupName: string;
  completeTasksShown: boolean;
  tasksByUsersShown: boolean;
  notesByUsersShown: boolean;
  transactionsByUsersShown: boolean;
  assignee: User | undefined;
  notesByOrderShown: boolean;
  tasksByOrderShown: boolean;
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
  transactionTimezone: string;
  transactionFrequencyType: FrequencyType;
  transactionStartDate: string;
  transactionEndDate: string;
  transactionLedgerSummaryType: LedgerSummaryType;
  projectLabels: Label[];
  getProject: (projectId: number) => void;
  deleteProject: (
    projectId: number,
    name: string,
    history: History<History.PoorMansUnknown>
  ) => void;
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
  getTasksByOrder: (
    projectId: number,
    timezone: string,
    startDate?: string,
    endDate?: string
  ) => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
  projectLabelsUpdate: (projectId: number) => void;
  setSelectedLabel: (label: Label) => void;
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
    hideLabel: false,
    groupName: '',
    completeTasksShown: false,
    //used for tasks by assignee modal
    tasksByUsersShown: false,
    notesByUsersShown: false,
    transactionsByUsersShown: false,
    notesByOrderShown: false,
    tasksByOrderShown: false,
    assignee: undefined,
  };

  componentDidMount() {
    this.props.updateExpandedMyself(true);
    const projectId = parseInt(this.props.match.params.projectId);
    this.props.getProject(projectId);
    this.setState({ completeTasksShown: false });
    this.props.projectLabelsUpdate(projectId);
    if (this.props.project) {
      document.title = this.props.project.name;
    }
  }

  componentDidUpdate(prevProps: ProjectPathProps): void {
    const projectId = this.props.match.params.projectId;
    if (projectId !== prevProps.match.params.projectId) {
      this.props.getProject(parseInt(projectId));
      this.setState({ completeTasksShown: false });
      this.props.projectLabelsUpdate(parseInt(projectId));
    }
    if (this.props.project) {
      document.title = this.props.project.name;
    }
  }

  // jump to label searching page by label click
  toLabelSearching = (label: Label) => {
    this.props.setSelectedLabel(label);
    this.props.history.push('/labels/search');
  };

  onClickGroup = (groupId: number) => {
    this.props.history.push(`/groups/group${groupId}`);
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
    this.props.getNotesByOrder(
      parseInt(this.props.match.params.projectId),
      timezone,
      undefined,
      undefined
    );
  };

  handleGetTasksByOrder = () => {
    const { timezone } = this.props;
    this.setState({ tasksByOrderShown: true });
    this.props.getTasksByOrder(
      parseInt(this.props.match.params.projectId),
      timezone,
      undefined,
      undefined
    );
  };

  handleGetProjectItemsByUserCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: this.handleGetNotesByOwner,
    [ProjectType.TODO]: this.handleGetTasksByAssignee,
    [ProjectType.LEDGER]: this.handleGetTransactionByPayer,
  };
  handleGetProjectItemsByOrderCall: { [key in ProjectType]: Function } = {
    [ProjectType.NOTE]: this.handleGetNotesByOrder,
    [ProjectType.TODO]: this.handleGetTasksByOrder,
    [ProjectType.LEDGER]: () => {},
  };

  getProjectLabels = () => {
    if (this.props.projectLabels.length === 0) {
      return null;
    }

    const hasLabel = this.props.projectLabels.length > 0;

    return (
      <>
       {hasLabel &&(<div>
        <div className="project-labels-icon">
          <span>
            {!this.state.hideLabel && (<UpOutlined onClick={() => {this.setState({hideLabel : true});}} />)}
            {this.state.hideLabel && (<DownOutlined onClick={() => {this.setState({hideLabel : false});}} />)}
          </span>
          {" "}
          <span>
            <Popover
                placement="top"
                content="Refresh Labels"
              >
                <SyncOutlined
              onClick={(event) => {
                event.stopPropagation();
                const projectId = parseInt(this.props.match.params.projectId);
                this.props.projectLabelsUpdate(projectId);
              }}
            />
              </Popover>
            
          </span>
        </div>

        {!this.state.hideLabel && <div className="project-labels">
          {this.props.projectLabels.map((label, index) => (
            <Tag
              key={label.id}
              color={stringToRGB(label.value)}
              onClick={() => this.toLabelSearching(label)}
            >
              <span>
                {getIcon(label.icon)} &nbsp;{label.value}
              </span>
            </Tag>
          ))}
        </div>}</div>)
     }   </>
    );
  };

  render() {
    const { project, myself, history } = this.props;

    if (!project) {
      return null;
    }

    const handleGetProjectItemsByUser = this.handleGetProjectItemsByUserCall[
      project.projectType
    ];
    const handleGetProjectItemsByOrder = this.handleGetProjectItemsByOrderCall[
      project.projectType
    ];
    let createContent = null;
    let projectContent = null;
    let projectItemsByUser = null;
    let projectItemsByOrder = null;

    switch (project.projectType) {
      case ProjectType.NOTE:
        createContent = <AddNote mode="icon" />;
        projectContent = (
          <NoteTree
            readOnly={project.shared}
            showModal={(user: User) => {
              handleGetProjectItemsByUser(user);
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
            projectId={project.id}
            visible={this.state.notesByOrderShown}
            onCancel={() => {
              this.setState({ notesByOrderShown: false });
            }}
          />
        );
        break;
      case ProjectType.TODO:
        createContent = <Container>
          <AddTask mode="icon"/>
          <FloatButton
              tooltip="Actions"
              styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
          >
            <MenuOutlined/>
          </FloatButton>
        </Container>

        projectContent = (
          <TaskTree
            timezone={this.props.timezone}
            readOnly={project.shared}
            showModal={(user: User) => {
              handleGetProjectItemsByUser(user);
            }}
            showOrderModal={() => {
              handleGetProjectItemsByOrder();
            }}
            completeTasksShown={this.state.completeTasksShown}
            hideCompletedTask={() =>
              this.setState({ completeTasksShown: false })
            }
            showCompletedTask={() =>
              this.setState({ completeTasksShown: true })
            }
          />
        );
        projectItemsByUser = (
          <TasksByAssignee
            assignee={this.state.assignee}
            visible={this.state.tasksByUsersShown}
            onCancel={() => {
              this.setState({ tasksByUsersShown: false });
            }}
            hideCompletedTask={() =>
              this.setState({ completeTasksShown: false })
            }
          />
        );
        projectItemsByOrder = (
          <TasksByOrder
            visible={this.state.tasksByOrderShown}
            onCancel={() => {
              this.setState({ tasksByOrderShown: false });
            }}
            hideCompletedTask={() =>
              this.setState({ completeTasksShown: false })
            }
          />
        );
        break;
      case ProjectType.LEDGER:
        createContent = <AddTransaction mode="icon" />;
        projectContent = (
          <TransactionProject
            showModal={(user: User) => {
              handleGetProjectItemsByUser(user);
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
    if (project && myself === project.owner.name) {
      editContent = <EditProject project={project} />;
      deleteContent = (
        <Popconfirm
          title="Deleting BuJo also deletes its child BuJo. Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            this.props.deleteProject(project.id, project.name, history);
          }}
          className="group-setting"
          placement="bottom"
        >
          <Tooltip placement="top" title="Delete BuJo">
            <div className="project-delete">
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
        <div className="project-description">
          {project.description.split('\n').map((s, key) => {
            return <p key={key}>{s}</p>;
          })}
        </div>
      );
    }

    const group = getGroupByProject(this.props.groups, project);
    let groupUsers = group ? group.users : [];
    if (project && project.shared) {
      createContent = null;
      editContent = null;
      deleteContent = null;
      if (groupUsers) {
        groupUsers = groupUsers.filter((u) => u.name === project.owner.name);
      }
    }

    let popContent = null;
    if (group) {
      popContent = (
        <div className="project-users">
          {groupUsers.map((u, index) => (
            <Tooltip title={u.alias} key={u.id}>
              <span
                className="avatar-container"
                onClick={() => handleGetProjectItemsByUser(u)}
              >
                <Avatar size="small" src={u.avatar} />
              </span>
            </Tooltip>
          ))}
        </div>
      );
    }

    return (
      <div
        className={`project ${
          project.projectType === ProjectType.LEDGER && 'ledger'
        }`}
      >
        <Tooltip
          placement="top"
          title={project.owner.alias}
          className="project-avatar"
        >
          <span>
            <Avatar size="large" src={project.owner.avatar} />
          </span>
        </Tooltip>
        <div className="project-header">
          <h2>
            {!description && (
              <span>
                {iconMapper[project.projectType]}
                &nbsp;{project.name}
              </span>
            )}
            {description && (
              <Popover
                placement="bottomLeft"
                content={description || project.name}
              >
                <span>
                  {iconMapper[project.projectType]}
                  &nbsp;{project.name}
                </span>
              </Popover>
            )}
          </h2>
          <div className="project-control">
            <Popover
              title={
                group && `${group.name} (${!!group ? groupUsers.length : 0})`
              }
              placement="bottom"
              content={popContent}
            >
              <span
                style={{ cursor: 'pointer' }}
                onClick={(e) => this.onClickGroup(group.id)}
              >
                <Badge
                  count={!!group ? groupUsers.length : 0}
                  style={{
                    fontSize: '9px',
                    color: '#006633',
                    backgroundColor: '#e6fff2',
                  }}
                >
                  <TeamOutlined style={{ fontSize: '21px' }} />
                </Badge>
              </span>
            </Popover>
            <ShowProjectHistory />
            {createContent}
            {editContent}
            {deleteContent}
            {projectItemsByUser}
            {projectItemsByOrder}
          </div>
        </div>
        {this.getProjectLabels()}
        <BackTop />
        <div className="project-content">{projectContent}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  groups: state.group.groups,
  myself: state.myself.username,
  transactionTimezone: state.transaction.timezone,
  transactionFrequencyType: state.transaction.frequencyType,
  transactionStartDate: state.transaction.startDate,
  transactionEndDate: state.transaction.endDate,
  transactionLedgerSummaryType: state.transaction.ledgerSummaryType,
  timezone: state.settings.timezone,
  projectLabels: state.label.projectLabels,
});

export default connect(mapStateToProps, {
  getProject,
  deleteProject,
  getTasksByAssignee,
  getNotesByOwner,
  getTransactionsByPayer,
  getNotesByOrder,
  getTasksByOrder,
  updateExpandedMyself,
  projectLabelsUpdate,
  setSelectedLabel,
})(ProjectPage);
