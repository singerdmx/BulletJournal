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
import moment from 'moment';
import { dateFormat } from '../../features/myBuJo/constants';
import MoveProjectItem from '../modals/move-project-item.component';
import ShareProjectItem from '../modals/share-project-item.component';
import { ProjectType } from '../../features/project/constants';
import { convertToTextWithRRule } from '../../features/recurrence/actions';
import {
  getIcon,
  getItemIcon,
} from '../draggable-labels/draggable-label-list.component';
import { addSelectedLabel } from '../../features/label/actions';
import {IState} from "../../store";

type ProjectProps = {
  readOnly: boolean;
  addSelectedLabel: (label: Label) => void;
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
}

type TaskProps = {
  aliases: any;
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
    return <div style={{ display: 'flex', flexDirection: 'column' }}>
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

export const getDueDateTime = (task: Task) => {
  if (task.recurrenceRule) {
    return (
      <div className='project-item-time'>
        {convertToTextWithRRule(task.recurrenceRule)}
      </div>
    );
  }

  if (!task.dueDate) {
    return null;
  }

  let dueDateTitle = moment(task.dueDate, dateFormat).fromNow();
  if (task.duration) {
    dueDateTitle += `, duration ${task.duration} minutes`;
  }

  return (
    <Tooltip title={dueDateTitle} placement={'bottom'}>
      <div className='project-item-time'>
        {task.dueDate} {task.dueTime}
      </div>
    </Tooltip>
  );
};

const TaskItem: React.FC<ProjectProps & ManageTaskProps & TaskProps> = (props) => {
  // hook history in router
  const history = useHistory();
  // jump to label searching page by label click
  const toLabelSearching = (label: Label) => {
    props.addSelectedLabel(label);
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
    inModal,
    isComplete,
    completeOnlyOccurrence,
    completeTask,
    uncompleteTask,
    deleteTask,
    deleteCompletedTask,
    aliases,
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
          <Avatar src={task.assignees[0].avatar} size='small' />
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
                <Avatar size='small' src={u.avatar} />
                &nbsp;{u.alias}
              </p>
            ))}
          </div>
        }
      >
        <Avatar src={task.assignees[0].avatar} size='small' />
      </Popover>
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
        </div>
      </div>

      <div className='project-control'>
        <div className='project-item-owner'>
          <Tooltip title={`Created by ${task.owner && aliases[task.owner] ? aliases[task.owner] : task.owner}`}>
            <Avatar src={task.ownerAvatar} size='small' />
          </Tooltip>
        </div>
        <div className='project-item-assignee'>{getAssignees()}</div>
        <div className='project-item-assignee'>
          <Tooltip title={getReminderSettingString(task.reminderSetting)}>
            <AlertOutlined />
          </Tooltip>
        </div>
        {getMore()}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  aliases: state.system.aliases
});

export default connect(mapStateToProps, {
  completeTask,
  uncompleteTask,
  deleteTask,
  deleteCompletedTask,
  addSelectedLabel,
})(TaskItem);
