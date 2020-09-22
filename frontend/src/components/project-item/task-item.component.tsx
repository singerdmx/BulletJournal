import React from 'react';
import {Avatar, Badge, message, Popconfirm, Popover, Tag, Tooltip} from 'antd';
import {
  AlertOutlined,
  CarryOutOutlined,
  CheckCircleTwoTone,
  CloseCircleOutlined,
  CopyOutlined,
  DeleteTwoTone,
  LoadingOutlined,
  MoreOutlined,
  PauseCircleOutlined,
  RotateRightOutlined,
  SmileOutlined,
  TeamOutlined
} from '@ant-design/icons';
import {getReminderSettingString, getTaskBackgroundColor, Task, TaskStatus,} from '../../features/tasks/interface';
import {connect} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {
  completeTask,
  deleteCompletedTask,
  deleteTask,
  setTaskStatus,
  uncompleteTask,
} from '../../features/tasks/actions';
import EditTask from '../modals/edit-task.component';
import './project-item.styles.less';
import {Label, stringToRGB} from '../../features/label/interface';
import moment from 'moment-timezone';
import MoveProjectItem from '../modals/move-project-item.component';
import ShareProjectItem from '../modals/share-project-item.component';
import {ProjectItemUIType, ProjectType,} from '../../features/project/constants';
import {convertToTextWithRRule} from '../../features/recurrence/actions';
import {getIcon, getItemIcon,} from '../draggable-labels/draggable-label-list.component';
import {setSelectedLabel} from '../../features/label/actions';
import {User} from '../../features/group/interface';
import {IState} from '../../store';
import {animation, IconFont, Item, Menu, MenuProvider, theme as ContextMenuTheme} from "react-contexify";
import 'react-contexify/dist/ReactContexify.min.css';
import CopyToClipboard from "react-copy-to-clipboard";

type ProjectProps = {
  readOnly: boolean;
  theme: string;
  setSelectedLabel: (label: Label) => void;
  showModal?: (user: User) => void;
  showOrderModal?: () => void;
};

type ManageTaskProps = {
  task: Task;
  type: ProjectItemUIType;
  inModal?: boolean;
  isComplete: boolean;
  completeOnlyOccurrence: boolean;
  uncompleteTask: (taskId: number) => void;
  completeTask: (
    taskId: number,
    type: ProjectItemUIType,
    dateTime?: string
  ) => void;
  deleteCompletedTask: (taskId: number) => void;
  deleteTask: (taskId: number, type: ProjectItemUIType) => void;
};

type TaskProps = {
  inProject: boolean;
  setTaskStatus: (taskId: number, taskStatus: TaskStatus, type: ProjectItemUIType) => void;
};

const ManageTask: React.FC<ManageTaskProps> = (props) => {
  const {
    task,
    type,
    inModal,
    isComplete,
    completeOnlyOccurrence,
    completeTask,
    uncompleteTask,
    deleteTask,
    deleteCompletedTask,
  } = props;

  const history = useHistory();

  if (isComplete) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          onClick={() => uncompleteTask(task.id)}
          className="popover-control-item"
        >
          <span>Uncomplete</span>
          <CloseCircleOutlined twoToneColor="#52c41a" />
        </div>
        <Popconfirm
          title="Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteCompletedTask(task.id)}
          className="group-setting"
          placement="bottom"
        >
          <div className="popover-control-item">
            <span>Delete</span>
            <DeleteTwoTone twoToneColor="#f5222d" />
          </div>
        </Popconfirm>
      </div>
    );
  }

  const handleCompleteTaskClick = () => {
    if (completeOnlyOccurrence) {
      completeTask(task.id, type, task.dueDate + ' ' + task.dueTime);
    } else {
      completeTask(task.id, type);
    }
  };

  const getCompleteButton = () => {
    if (completeOnlyOccurrence || !task.recurrenceRule) {
      return <div
          onClick={() => handleCompleteTaskClick()}
          className="popover-control-item"
      >
        <span>Complete</span>
        <CheckCircleTwoTone twoToneColor="#52c41a"/>
      </div>;
    }

    return <Popconfirm
        title="One Time Only or All Events"
        okText="Series"
        cancelText="Occurrence"
        onConfirm={() => handleCompleteTaskClick()}
        onCancel={() => history.push('/bujo/today')}
        placement="bottom"
    >
      <div className="popover-control-item">
        <span>Complete</span>
        <CheckCircleTwoTone twoToneColor="#52c41a"/>
      </div>
    </Popconfirm>
  }

  if (inModal === true) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {getCompleteButton()}
        <Popconfirm
          title="Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteTask(task.id, type)}
          className="group-setting"
          placement="bottom"
        >
          <div className="popover-control-item">
            <span>Delete</span>
            <DeleteTwoTone twoToneColor="#f5222d" />
          </div>
        </Popconfirm>
      </div>
    );
  }

  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <EditTask task={task} mode="div" type={type}/>
      <MoveProjectItem
          type={ProjectType.TODO}
          projectItemId={task.id}
          mode="div"
      />
      <ShareProjectItem
          type={ProjectType.TODO}
          projectItemId={task.id}
          mode="div"
      />
      {getCompleteButton()}
      <Popconfirm
          title="Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteTask(task.id, type)}
          className="group-setting"
          placement="bottom"
      >
        <div className="popover-control-item">
          <span>Delete</span>
          <DeleteTwoTone twoToneColor="#f5222d"/>
        </div>
      </Popconfirm>
    </div>
  );
};

const getCompletionTime = (task: Task) => {
  return (
    <Tooltip
      title={task.createdAt && `Completed ${moment(task.createdAt).fromNow()}`}
      placement={'bottom'}
    >
      <div className="project-item-time">
        <Tag color="green">
          {task.createdAt && moment(task.createdAt).format('YYYY-MM-DD HH:mm')}
        </Tag>
      </div>
    </Tooltip>
  );
};

export const getDuration = (minutes: number) => {
  let days = '';
  let hours = '';
  let mins = '';
  if (minutes >= 1440) {
    const d = Math.floor(minutes / 1440);
    minutes -= d * 1440;
    days = d === 1 ? '1 day ' : `${d} days `;
  }
  if (minutes >= 60) {
    const h = Math.floor(minutes / 60);
    minutes -= h * 60;
    hours = h === 1 ? '1 hour ' : `${h} hours `;
  }
  if (minutes > 0) {
    mins = minutes === 1 ? '1 minute' : `${minutes} minutes`;
  }
  return days + hours + mins;
};

export const getDueDateTime = (task: Task) => {
  let duration = null;
  if (task.duration) {
    duration = getDuration(task.duration);
  }
  if (task.recurrenceRule) {
    let s = convertToTextWithRRule(task.recurrenceRule);
    if (duration) {
      s += `, duration ${duration}`;
    }
    return (
      <Tooltip title={s} placement="bottom">
        <div className="project-item-time">
          <Tag className="item-tag">{s}</Tag>
        </div>
      </Tooltip>
    );
  }

  if (!task.dueDate) {
    return null;
  }

  let dueDateTitle =
    'Due ' +
    moment
      .tz(
        `${task.dueDate} ${task.dueTime ? task.dueTime : '00:00'}`,
        task.timezone
      )
      .fromNow();
  if (duration) {
    dueDateTitle += `, duration ${duration}`;
  }

  return (
    <Tooltip title={dueDateTitle} placement={'bottom'}>
      <div className="project-item-time">
        <Tag>
          {task.dueDate} {task.dueTime}
        </Tag>
      </div>
    </Tooltip>
  );
};

export const getTaskAssigneesPopoverContent = (
  task: Task,
  getAvatar: (user: User) => any
) => {
  return (
    <div className="task-assignees">
      {task.assignees.map((u, index) => (
        <Tooltip title={u.alias} key={u.id}>
          <span key={index}>{getAvatar(u)}</span>
        </Tooltip>
      ))}
    </div>
  );
};

const TaskItem: React.FC<ProjectProps & ManageTaskProps & TaskProps> = (
  props
) => {
  const {
    task,
    theme,
    type,
    inProject,
    inModal,
    isComplete,
    completeOnlyOccurrence,
    completeTask,
    uncompleteTask,
    deleteTask,
    deleteCompletedTask,
    showModal,
    showOrderModal,
    readOnly,
    setTaskStatus,
    setSelectedLabel
  } = props;

  // hook history in router
  const history = useHistory();
  // jump to label searching page by label click
  const toLabelSearching = (label: Label) => {
    setSelectedLabel(label);
    history.push('/labels/search');
  };

  const getMore = () => {
    if (readOnly) {
      return null;
    }
    return (
      <Popover
        arrowPointAtCenter
        placement="rightTop"
        overlayStyle={{ width: '150px' }}
        content={
          <ManageTask
            task={task}
            type={type}
            inModal={inModal}
            isComplete={isComplete}
            completeOnlyOccurrence={completeOnlyOccurrence}
            completeTask={completeTask}
            uncompleteTask={uncompleteTask}
            deleteTask={deleteTask}
            deleteCompletedTask={deleteCompletedTask}
          />
        }
        z-index={500}
        trigger="click"
      >
        <span className="project-control-more">
          <MoreOutlined />
        </span>
      </Popover>
    );
  };

  const taskStyle = isComplete
    ? 'project-item-name completed-task'
    : 'project-item-name';

  const handleClick = () => {
    if (props.readOnly || task.shared) {
      // if readOnly, link to shared item page
      history.push(`/sharedItems/TASK${task.id}`);
    } else if (isComplete) {
      // if isComplete, go to completedTask page
      history.push(`/completedTask/${task.id}`);
    } else {
      history.push(`/task/${task.id}`);
    }
  };

  const getAssignees = () => {
    if (!task.assignees || task.assignees.length === 0) {
      return null;
    }

    if (task.assignees.length === 1) {
      return (
        <Tooltip title={`Assignee ${task.assignees[0].alias}`}>
          {getAvatar(task.assignees[0])}
        </Tooltip>
      );
    }

    return (
      <Popover
        title={`${task.assignees.length} Assignees`}
        placement="bottom"
        content={getTaskAssigneesPopoverContent(task, getAssigneesPopupAvatar)}
      >
        {getAssigneesIcon(task)}
      </Popover>
    );
  };

  const getAssigneesIcon = (task: Task) => {
    return (
      <div key={task.id} style={{ marginRight: '8px' }}>
        <Badge
          count={task.assignees.length}
          style={{
            fontSize: '9px',
            color: '#006633',
            backgroundColor: '#e6fff2',
          }}
        >
          <TeamOutlined style={{ fontSize: '20px' }} />
        </Badge>
      </div>
    );
  };

  const getAvatar = (user: User) => {
    if (!inProject || !showModal) {
      return (
        <div key={user.name}>
          <Avatar src={user.avatar} size={20} />
        </div>
      );
    }
    return (
      <div
        key={user.name}
        onClick={() => {
          showModal(user);
        }}
      >
        <Avatar src={user.avatar} size={20} style={{ cursor: 'pointer' }} />
      </div>
    );
  };

  const getAssigneesPopupAvatar = (user: User) => {
    if (!inProject || !showModal) {
      return (
        <span>
          <Avatar src={user.avatar} size="small" />
        </span>
      );
    }
    return (
      <span
        onClick={(e) => {
          e.stopPropagation();
          showModal(user);
        }}
      >
        <Avatar src={user.avatar} size="small" style={{ cursor: 'pointer' }} />
      </span>
    );
  };

  const getOrderIcon = () => {
    if (!inProject || !showOrderModal) return <AlertOutlined />;
    return (
      <AlertOutlined
        onClick={(e) => {
          e.stopPropagation();
          showOrderModal();
        }}
      />
    );
  };

  let linkAddress = `${window.location.origin.toString()}/#/task/${task.id}`;
  if (isComplete) {
    linkAddress = `${window.location.origin.toString()}/#/completedTask/${task.id}`;
  }

  const getProjectItemContentDiv = () => {
    return <div className="project-item-content">
      <a onClick={handleClick}>
        <h3 className={taskStyle}>
          <Tooltip title={`Created by ${task.owner.alias}`}>
            {getAssigneesPopupAvatar(task.owner)}
          </Tooltip>{' '}
          {getItemIcon(task, <CarryOutOutlined/>)} {task.name}
        </h3>
      </a>
      <div className="project-item-subs">
        <div className="project-item-labels">
          {task.labels &&
          task.labels.map((label) => {
            return (
                <Tag
                    key={`label${label.id}`}
                    className="labels"
                    onClick={() => toLabelSearching(label)}
                    color={stringToRGB(label.value)}
                    style={{cursor: 'pointer', borderRadius: 10}}
                >
                    <span>
                      {getIcon(label.icon)} &nbsp;
                      {label.value}
                    </span>
                </Tag>
            );
          })}
        </div>
        {getDueDateTime(task)}
        {isComplete && getCompletionTime(task)}
      </div>
    </div>
  }

  const getProjectItemContentWithMenu = () => {
    if (inModal === true) {
      return getProjectItemContentDiv()
    }

    return <>
      <MenuProvider id={`task${task.id}`}>
        {getProjectItemContentDiv()}
      </MenuProvider>

      <Menu id={`task${task.id}`}
            theme={theme === 'DARK' ? ContextMenuTheme.dark : ContextMenuTheme.light}
            animation={animation.zoom}>
        <CopyToClipboard
            text={`${task.name} ${linkAddress}`}
            onCopy={() => message.success('Link Copied to Clipboard')}
        >
          <Item>
            <IconFont style={{fontSize: '14px', paddingRight: '6px'}}><CopyOutlined/></IconFont>
            <span>Copy Link Address</span>
          </Item>
        </CopyToClipboard>
        {!isComplete && <Item onClick={() => setTaskStatus(task.id, TaskStatus.IN_PROGRESS, type)}>
          <IconFont style={{fontSize: '14px', paddingRight: '6px'}}><LoadingOutlined/></IconFont>
          <span>Set Status to IN PROGRESS</span>
        </Item>}
        {!isComplete && <Item onClick={() => setTaskStatus(task.id, TaskStatus.NEXT_TO_DO, type)}>
          <IconFont style={{fontSize: '14px', paddingRight: '6px'}}><RotateRightOutlined/></IconFont>
          <span>Set Status to NEXT TO DO</span>
        </Item>}
        {!isComplete && <Item onClick={() => setTaskStatus(task.id, TaskStatus.READY, type)}>
          <IconFont style={{fontSize: '14px', paddingRight: '6px'}}><SmileOutlined/></IconFont>
          <span>Set Status to READY</span>
        </Item>}
        {!isComplete && <Item onClick={() => setTaskStatus(task.id, TaskStatus.ON_HOLD, type)}>
          <IconFont style={{fontSize: '14px', paddingRight: '6px'}}><PauseCircleOutlined/></IconFont>
          <span>Set Status to ON HOLD</span>
        </Item>}
      </Menu>
    </>;
  }

  return (
      <div
          className="project-item"
          style={getTaskBackgroundColor(task.status, theme)}
      >
        {getProjectItemContentWithMenu()}
        <div className="project-control">
          <div className="project-item-assignee">{getAssignees()}</div>
          <div>
            <Tooltip title={getReminderSettingString(task.reminderSetting)}>
              {getOrderIcon()}
            </Tooltip>
          </div>
          {getMore()}
        </div>
      </div>
  );
};

const mapStateToProps = (state: IState) => ({
  theme: state.myself.theme,
});

export default connect(mapStateToProps, {
  completeTask,
  uncompleteTask,
  deleteTask,
  deleteCompletedTask,
  setSelectedLabel,
  setTaskStatus
})(TaskItem);
