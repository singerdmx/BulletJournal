import React from 'react';
import {RouteComponentProps} from 'react-router';
import {Project} from '../../features/project/interface';
import {IState} from '../../store';
import {connect} from 'react-redux';
import {GroupsWithOwner, User} from '../../features/group/interface';
import {Avatar, BackTop, Badge, message, Popconfirm, Popover, Radio, Tag, Tooltip} from 'antd';
import {deleteProject, getProject} from '../../features/project/actions';
import {iconMapper} from '../../components/side-menu/side-menu.component';
import {DeleteOutlined, DownOutlined, TeamOutlined, UpOutlined,} from '@ant-design/icons';
import EditProject from '../../components/modals/edit-project.component';
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
import {animation, IconFont, Item, Menu, MenuProvider} from "react-contexify";
import {theme as ContextMenuTheme} from "react-contexify/lib/utils/styles";
import CopyToClipboard from "react-copy-to-clipboard";
import {CheckSquareTwoTone, CloseCircleTwoTone, CopyOutlined, MenuOutlined, StopTwoTone} from "@ant-design/icons/lib";
import {RadioChangeEvent} from "antd/lib/radio";
import {getCookie} from "../../index";

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
  labelsToKeep: number[];
  labelsToRemove: number[];
};

type GroupProps = {
  groups: GroupsWithOwner[];
};

interface ProjectPathProps extends RouteComponentProps<ProjectPathParams> {
  projectId: string;
}

type ProjectPageProps = {
  theme: string;
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
  projectLabelsUpdate: (projectId: number, projectShared: boolean) => void;
  setSelectedLabel: (label: Label) => void;
};

type MyselfProps = {
  myself: string;
};

class ProjectPage extends React.Component<ProjectPageProps & ProjectPathProps & GroupProps & MyselfProps,
    ModalState> {
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
    labelsToKeep: [],
    labelsToRemove: [],
  };

  componentDidMount() {
    const loginCookie = getCookie('__discourse_proxy');
    if (!loginCookie) {
      return;
    }
    this.props.updateExpandedMyself(true);
    const projectId = parseInt(this.props.match.params.projectId);
    this.props.getProject(projectId);
    this.setState({completeTasksShown: false});
    if (this.props.project) {
      document.title = this.props.project.name;
      this.props.projectLabelsUpdate(projectId, this.props.project.shared);
    }
  }

  componentDidUpdate(prevProps: ProjectPathProps): void {
    const projectId = this.props.match.params.projectId;
    if (projectId !== prevProps.match.params.projectId) {
      this.props.getProject(parseInt(projectId));
      this.setState({completeTasksShown: false});
      if (this.props.project) {
        this.props.projectLabelsUpdate(parseInt(projectId), this.props.project.shared);
      }
      this.setState({labelsToRemove: [], labelsToKeep: []});
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
    this.setState({isShow: false});
  };
  //by user modal
  handleGetTasksByAssignee = (u: User) => {
    this.setState({tasksByUsersShown: true});
    this.setState({assignee: u});
    // update tasks
    this.props.getTasksByAssignee(
        parseInt(this.props.match.params.projectId),
        u.name
    );
  };

  handleGetNotesByOwner = (u: User) => {
    this.setState({notesByUsersShown: true});
    this.setState({assignee: u});
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
    this.setState({transactionsByUsersShown: true});
    this.setState({assignee: u});
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
    const {timezone} = this.props;
    this.setState({notesByOrderShown: true});
    this.props.getNotesByOrder(
        parseInt(this.props.match.params.projectId),
        timezone,
        undefined,
        undefined
    );
  };

  handleGetTasksByOrder = () => {
    const {timezone} = this.props;
    this.setState({tasksByOrderShown: true});
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
    [ProjectType.LEDGER]: () => {
    },
  };

  getProjectLabels = () => {
    if (this.props.projectLabels.length === 0) {
      return null;
    }

    if (!this.props.project) {
      return null;
    }

    const radioStyle = {
      display: 'block',
      height: '26px',
      lineHeight: '26px',
    };

    const getLabelFilterValue = (labelId: number) => {
      if (this.state.labelsToRemove.includes(labelId)) {
        return 2;
      }
      if (this.state.labelsToKeep.includes(labelId)) {
        return 1;
      }

      return 3;
    }

    const getLabelFilterIcon = (labelId: number) => {
      if (this.state.labelsToRemove.includes(labelId)) {
        return <CloseCircleTwoTone/>;
      }
      if (this.state.labelsToKeep.includes(labelId)) {
        return <CheckSquareTwoTone/>;
      }
      return <MenuOutlined/>
    }

    const handleLabelFilterChange = (e: RadioChangeEvent, labelId: number) => {
      const labelsToKeep = this.state.labelsToKeep.filter(l => l !== labelId);
      const labelsToRemove = this.state.labelsToRemove.filter(l => l !== labelId);
      switch (e.target.value) {
        case 1:
          labelsToKeep.unshift(labelId);
          break;
        case 2:
          labelsToRemove.unshift(labelId);
          break;
      }
      this.setState({labelsToRemove: labelsToRemove, labelsToKeep: labelsToKeep});
    }

    return (
        <>
          <div>
            <div className="project-labels-icon">
              <span>
                {!this.state.hideLabel && (<Tooltip
                    placement="top"
                    title="Hide Labels"
                ><UpOutlined onClick={() => {
                  this.setState({hideLabel: true});
                }}/>
                </Tooltip>)}
                {this.state.hideLabel && (<Tooltip
                    placement="top"
                    title="Show Project Labels"
                ><DownOutlined onClick={() => {
                  this.setState({hideLabel: false});
                }}/></Tooltip>)}
              </span>
            </div>

            {!this.state.hideLabel && <div className="project-labels">
              {this.props.projectLabels.map((label, index) => (
                  <>
                    <Tag
                        key={label.id}
                        color={stringToRGB(label.value)}
                    >
                      <span>
                        <Popover key={`p${label.id}`}
                                 title='Filter by Label'
                                 content={<>
                                   <Radio.Group value={getLabelFilterValue(label.id)}
                                                onChange={e => handleLabelFilterChange(e, label.id)}>
                                     <Radio style={radioStyle} value={1}>
                                       <CheckSquareTwoTone/> Keep <Tag color={stringToRGB(label.value)}
                                                                       key={`keep${label.id}`}>{getIcon(label.icon)} &nbsp;{label.value}</Tag>
                                     </Radio>
                                     <Radio style={radioStyle} value={2}>
                                       <CloseCircleTwoTone/> Without <Tag color={stringToRGB(label.value)}
                                                                          key={`remove${label.id}`}>{getIcon(label.icon)} &nbsp;{label.value}</Tag>
                                     </Radio>
                                     <Radio style={radioStyle} value={3}>
                                       <StopTwoTone/> No Effect
                                     </Radio>
                                   </Radio.Group>
                                 </>}>
                          {getLabelFilterIcon(label.id)}
                        </Popover>
                        <span onClick={() => this.toLabelSearching(label)}>&nbsp;
                          {getIcon(label.icon)} &nbsp;{label.value}
                        </span>
                      </span>
                    </Tag>
                  </>
              ))}
            </div>}</div>
        </>
    );
  };

  render() {
    const {project, myself, history} = this.props;

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
        createContent = null; // NOTE has createContent in note-tree.component.tsx
        projectContent = (
            <NoteTree
                timezone={this.props.timezone}
                readOnly={project.shared}
                showModal={(user: User) => {
                  handleGetProjectItemsByUser(user);
                }}
                showOrderModal={() => {
                  handleGetProjectItemsByOrder();
                }}
                labelsToKeep={this.state.labelsToKeep}
                labelsToRemove={this.state.labelsToRemove}
            />
        );
        projectItemsByUser = (
            <NotesByOwner
                owner={this.state.assignee}
                visible={this.state.notesByUsersShown}
                onCancel={() => {
                  this.setState({notesByUsersShown: false});
                }}
            />
        );
        projectItemsByOrder = (
            <NotesByOrder
                projectId={project.id}
                visible={this.state.notesByOrderShown}
                onCancel={() => {
                  this.setState({notesByOrderShown: false});
                }}
            />
        );
        break;
      case ProjectType.TODO:
        createContent = null; // TODO has createContent in task-tree.component.tsx

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
                    this.setState({completeTasksShown: false})
                }
                showCompletedTask={() =>
                    this.setState({completeTasksShown: true})
                }
                labelsToKeep={this.state.labelsToKeep}
                labelsToRemove={this.state.labelsToRemove}
            />
        );
        projectItemsByUser = (
            <TasksByAssignee
                assignee={this.state.assignee}
                visible={this.state.tasksByUsersShown}
                onCancel={() => {
                  this.setState({tasksByUsersShown: false});
                }}
                hideCompletedTask={() =>
                    this.setState({completeTasksShown: false})
                }
            />
        );
        projectItemsByOrder = (
            <TasksByOrder
                visible={this.state.tasksByOrderShown}
                onCancel={() => {
                  this.setState({tasksByOrderShown: false});
                }}
                hideCompletedTask={() =>
                    this.setState({completeTasksShown: false})
                }
            />
        );
        break;
      case ProjectType.LEDGER:
        createContent = <AddTransaction mode="icon"/>;
        projectContent = (
            <TransactionProject
                showModal={(user: User) => {
                  handleGetProjectItemsByUser(user);
                }}
                labelsToKeep={this.state.labelsToKeep}
                labelsToRemove={this.state.labelsToRemove}
            />
        );
        projectItemsByUser = (
            <TransactionsByPayer
                payer={this.state.assignee}
                visible={this.state.transactionsByUsersShown}
                onCancel={() => {
                  this.setState({transactionsByUsersShown: false});
                }}
            />
        );
    }

    let editContent = null;
    let deleteContent = null;
    if (project && myself === project.owner.name) {
      editContent = <EditProject project={project}/>;
      deleteContent = (
          <Popconfirm
              title="Are you sure?"
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
                    style={{paddingLeft: '0.5em', cursor: 'pointer'}}
                />
              </div>
            </Tooltip>
          </Popconfirm>
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
                <Tooltip title={u.alias} key={`${u.id}#${index}`}>
              <span
                  className="avatar-container"
                  onClick={() => handleGetProjectItemsByUser(u)}
              >
                <Avatar size="small" src={u.avatar}/>
              </span>
                </Tooltip>
            ))}
          </div>
      );
    }

    let projectHeader = (
        <div className="project-header">
          <h2>
            {this.getProjectNameSpan(project)}
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
                  style={{cursor: 'pointer'}}
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
                  <TeamOutlined style={{fontSize: '21px'}}/>
                </Badge>
              </span>
            </Popover>
            <ShowProjectHistory/>
            {createContent}
            {editContent}
            {deleteContent}
            {projectItemsByUser}
            {projectItemsByOrder}
          </div>
        </div>
    );

    if (project.description) {
      projectHeader = <Popover
          placement="bottom"
          content={<div className="project-description">
            {project.description.split('\n').map((s, key) => {
              return <p key={key}>{s}</p>;
            })}
          </div>}
      >
        {projectHeader}
      </Popover>
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
            <Avatar size="large" src={project.owner.avatar}/>
          </span>
          </Tooltip>
          {projectHeader}
          {this.getProjectLabels()}
          <BackTop/>
          <div className="project-content">{projectContent}</div>
        </div>
    );
  }

  getProjectNameSpan = (project: Project) => {
    return <>
      <MenuProvider id={`pr${project.id}`}>
        <span>
                {iconMapper[project.projectType]}
          &nbsp;{project.name}
        </span>
      </MenuProvider>
      <Menu id={`pr${project.id}`}
            theme={this.props.theme === 'DARK' ? ContextMenuTheme.dark : ContextMenuTheme.light}
            animation={animation.zoom}>
        <CopyToClipboard
            text={`${project.name} ${window.location.origin.toString()}/#/projects/${project.id}`}
            onCopy={() => message.success('Link Copied to Clipboard')}
        >
          <Item>
            <IconFont
                style={{fontSize: '14px', paddingRight: '6px'}}><CopyOutlined/></IconFont>
            <span>Copy Link Address</span>
          </Item>
        </CopyToClipboard>
      </Menu>
    </>
  }
}

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  groups: state.group.groups,
  myself: state.myself.username,
  theme: state.myself.theme,
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
