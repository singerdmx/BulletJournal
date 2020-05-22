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
import { getReminderSettingString, Task } from '../../features/tasks/interface';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
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
import { ProjectType } from '../../features/project/constants';
import { convertToTextWithRRule } from '../../features/recurrence/actions';
import {
  getIcon,
  getItemIcon,
} from '../draggable-labels/draggable-label-list.component';
import { setSelectedLabel } from '../../features/label/actions';
import { IState } from '../../store';
import { User } from '../../features/group/interface';

type ProjectProps = {
  readOnly: boolean;
  setSelectedLabel: (label: Label) => void;
  showModal?: (user: User) => void;
  showOrderModal?: () => void;
};

type ManageTaskProps = {
  task: Task;
  inModal?: boolean;
  isComplete: boolean;
  completeOnlyOccurrence: boolean;
  uncompleteTask: (taskId: number) => void;
  completeTask: (taskId: number, dateTime?: string) => void;
  deleteCompletedTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
};

type TaskProps = {
  aliases: any;
  inProject: boolean;
};

const ManageTask: React.FC<ManageTaskProps> = (props) => {
  const {
    task,
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
      completeTask(task.id, task.dueDate + ' ' + task.dueTime);
    } else {
      completeTask(task.id);
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
          onConfirm={() => deleteTask(task.id)}
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
        onConfirm={() => deleteTask(task.id)}
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
      <Tooltip title={task.createdAt && `Completed ${moment(task.createdAt).fromNow()}`} placement={'bottom'}>
        <div className='project-item-time'>
          <Tag color='green'>{task.createdAt && moment(task.createdAt).format('YYYY-MM-DD HH:mm')}</Tag>
        </div>
      </Tooltip>
  );
};

export const getDueDateTime = (task: Task) => {
  if (task.recurrenceRule) {
    const s = convertToTextWithRRule(task.recurrenceRule);
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

  let dueDateTitle = 'Due ' + moment
    .tz(
      `${task.dueDate} ${task.dueTime ? task.dueTime : '00:00'}`,
      task.timezone
    )
    .fromNow();
  if (task.duration) {
    dueDateTitle += `, duration ${task.duration} minutes`;
  }

  return (
    <Tooltip title={dueDateTitle} placement={'bottom'}>
      <div className='project-item-time'>
        <Tag>{task.dueDate} {task.dueTime}</Tag>
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
    inProject,
    inModal,
    isComplete,
    completeOnlyOccurrence,
    completeTask,
    uncompleteTask,
    deleteTask,
    deleteCompletedTask,
    aliases,
    showModal,
    showOrderModal,
  } = props;

  const taskStyle = isComplete
    ? 'project-item-name completed-task'
    : 'project-item-name';
  // if readOnly, link to public item page
  // if isComplete, go to completedTask page
  let taskLink = `/task/${task.id}`;
  if (props.readOnly) {
    taskLink = `/public/items/TASK${task.id}`;
  } else if (isComplete) {
    taskLink = `/completedTask/${task.id}`;
  }

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
    <div className='project-item'>
      <div className='project-item-content'>
        <Link to={taskLink}>
          <h3 className={taskStyle}>
            {getItemIcon(task, <CarryOutOutlined />)} {task.name}
          </h3>
        </Link>
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
          <Tooltip
            title={`Created by ${
              task.owner && aliases[task.owner]
                ? aliases[task.owner]
                : task.owner
            }`}
          >
            {getAvatar({
              accepted: true,
              avatar: task.ownerAvatar ? task.ownerAvatar : '',
              id: 0,
              name: task.owner ? task.owner : '',
              alias: task.owner ? task.owner : '',
              thumbnail: '',
            })}
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
  aliases: state.system.aliases,
});

export default connect(mapStateToProps, {
  completeTask,
  uncompleteTask,
  deleteTask,
  deleteCompletedTask,
  setSelectedLabel,
})(TaskItem);
