import React from 'react';
import { Avatar, Popconfirm, Popover, Tag, Tooltip } from 'antd';
import {
  AlertOutlined,
  CarryOutOutlined,
  CheckCircleTwoTone,
  CloseCircleOutlined,
  DeleteTwoTone,
  MoreOutlined,
} from '@ant-design/icons';
import {
  getReminderSettingString,
  Task,
  getTaskBackgroundColor,
} from '../../features/tasks/interface';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import {
  completeTask,
  deleteCompletedTask,
  deleteTask,
  uncompleteTask,
} from '../../features/tasks/actions';
import EditTask from '../modals/edit-task.component';
import './project-item.styles.less';
import { Label, stringToRGB } from '../../features/label/interface';
import moment from 'moment-timezone';
import MoveProjectItem from '../modals/move-project-item.component';
import ShareProjectItem from '../modals/share-project-item.component';
import {
  ProjectItemUIType,
  ProjectType,
} from '../../features/project/constants';
import { convertToTextWithRRule } from '../../features/recurrence/actions';
import {
  getIcon,
  getItemIcon,
} from '../draggable-labels/draggable-label-list.component';
import { setSelectedLabel } from '../../features/label/actions';
import { User } from '../../features/group/interface';
import { IState } from '../../store';

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
  if (isComplete) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          onClick={() => uncompleteTask(task.id)}
          className='popover-control-item'
        >
          <span>Uncomplete</span>
          <CloseCircleOutlined twoToneColor='#52c41a' />
        </div>
        <Popconfirm
          title='Are you sure?'
          okText='Yes'
          cancelText='No'
          onConfirm={() => deleteCompletedTask(task.id)}
          className='group-setting'
          placement='bottom'
        >
          <div className='popover-control-item'>
            <span>Delete</span>
            <DeleteTwoTone twoToneColor='#f5222d' />
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

  if (inModal === true) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div
          onClick={() => handleCompleteTaskClick()}
          className='popover-control-item'
        >
          <span>Complete</span>
          <CheckCircleTwoTone twoToneColor='#52c41a' />
        </div>
        <Popconfirm
          title='Deleting Task also deletes its child tasks. Are you sure?'
          okText='Yes'
          cancelText='No'
          onConfirm={() => deleteTask(task.id, type)}
          className='group-setting'
          placement='bottom'
        >
          <div className='popover-control-item'>
            <span>Delete</span>
            <DeleteTwoTone twoToneColor='#f5222d' />
          </div>
        </Popconfirm>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <EditTask task={task} mode='div' />
      <MoveProjectItem
        type={ProjectType.TODO}
        projectItemId={task.id}
        mode='div'
      />
      <ShareProjectItem
        type={ProjectType.TODO}
        projectItemId={task.id}
        mode='div'
      />
      <div
        onClick={() => handleCompleteTaskClick()}
        className='popover-control-item'
      >
        <span>Complete</span>
        <CheckCircleTwoTone twoToneColor='#52c41a' />
      </div>
      <Popconfirm
        title='Deleting Task also deletes its child tasks. Are you sure?'
        okText='Yes'
        cancelText='No'
        onConfirm={() => deleteTask(task.id, type)}
        className='group-setting'
        placement='bottom'
      >
        <div className='popover-control-item'>
          <span>Delete</span>
          <DeleteTwoTone twoToneColor='#f5222d' />
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
      <div className='project-item-time'>
        <Tag color='green'>
          {task.createdAt && moment(task.createdAt).format('YYYY-MM-DD HH:mm')}
        </Tag>
      </div>
    </Tooltip>
  );
};

const getDuration = (minutes: number) => {
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
      <Tooltip title={s} placement='bottom'>
        <div className='project-item-time'>
          <Tag className='item-tag'>{s}</Tag>
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
      <div className='project-item-time'>
        <Tag>
          {task.dueDate} {task.dueTime}
        </Tag>
      </div>
    </Tooltip>
  );
};

const TaskItem: React.FC<ProjectProps & ManageTaskProps & TaskProps> = (
  props
) => {
  // hook history in router
  const history = useHistory();
  // jump to label searching page by label click
  const toLabelSearching = (label: Label) => {
    props.setSelectedLabel(label);
    history.push('/labels/search');
  };

  const getMore = () => {
    if (props.readOnly) {
      return null;
    }
    return (
      <Popover
        arrowPointAtCenter
        placement='rightTop'
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
        trigger='click'
      >
        <span className='project-control-more'>
          <MoreOutlined />
        </span>
      </Popover>
    );
  };

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
  } = props;

  const taskStyle = isComplete
    ? 'project-item-name completed-task'
    : 'project-item-name';

  const handleClick = () => {
    if (props.readOnly) {
      // if readOnly, link to public item page
      history.push(`/public/items/TASK${task.id}`);
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
        title='Assignees'
        placement='bottom'
        content={
          <div>
            {task.assignees.map((u, index) => (
              <p key={index}>
                {getAvatar(u)}
                &nbsp;{u.alias}
              </p>
            ))}
          </div>
        }
      >
        {getAvatar(task.assignees[0])}
      </Popover>
    );
  };

  const getAvatar = (user: User) => {
    if (!inProject) return <Avatar src={user.avatar} size='small' />;
    if (!showModal) return <Avatar src={user.avatar} size='small' />;
    return (
      <span
        onClick={() => {
          showModal(user);
        }}
      >
        <Avatar src={user.avatar} size='small' style={{ cursor: 'pointer' }} />
      </span>
    );
  };

  const getOrderIcon = () => {
    if (!inProject) return <AlertOutlined />;
    if (!showOrderModal) return <AlertOutlined />;
    return (
      <span
        onClick={() => {
          showOrderModal();
        }}
      >
        <AlertOutlined />
      </span>
    );
  };

  return (
    <div
      className='project-item'
      style={getTaskBackgroundColor(task.status, theme)}
    >
      <div className='project-item-content'>
        <a onClick={handleClick}>
          <h3 className={taskStyle}>
            {getItemIcon(task, <CarryOutOutlined />)} {task.name}
          </h3>
        </a>
        <div className='project-item-subs'>
          <div className='project-item-labels'>
            {task.labels &&
              task.labels.map((label) => {
                return (
                  <Tag
                    key={`label${label.id}`}
                    className='labels'
                    onClick={() => toLabelSearching(label)}
                    color={stringToRGB(label.value)}
                    style={{ cursor: 'pointer', borderRadius: 10 }}
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

      <div className='project-control'>
        <div className='project-item-owner'>
          <Tooltip title={`Created by ${task.owner.alias}`}>
            {getAvatar(task.owner)}
          </Tooltip>
        </div>
        <div className='project-item-assignee'>{getAssignees()}</div>
        <div className='project-item-assignee'>
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
})(TaskItem);
