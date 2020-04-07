import React from 'react';
import {Avatar, Popconfirm, Popover, Tag, Tooltip} from 'antd';
import {
  AlertOutlined,
  CarryOutOutlined,
  CheckCircleTwoTone,
  CloseCircleOutlined,
  DeleteTwoTone,
  MoreOutlined,
  TagOutlined
} from '@ant-design/icons';
import {getReminderSettingString, Task} from '../../features/tasks/interface';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {completeTask, deleteCompletedTask, deleteTask, uncompleteTask} from '../../features/tasks/actions';
import EditTask from '../modals/edit-task.component';
import './project-item.styles.less';
import {icons} from '../../assets/icons';
import {stringToRGB} from '../../features/label/interface';
import moment from 'moment';
import {dateFormat} from '../../features/myBuJo/constants';
import MoveProjectItem from '../modals/move-project-item.component';
import ShareProjectItem from '../modals/share-project-item.component';
import {ProjectType} from '../../features/project/constants';
import {convertToTextWithRRule} from '../../features/recurrence/actions';

type ProjectProps = {
  readOnly: boolean;
};

type TaskProps = {
  task: Task;
  isComplete: boolean;
  completeTask: (taskId: number) => void;
  uncompleteTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  deleteCompletedTask: (taskId: number) => void;
};

const ManageTask: React.FC<TaskProps> = props => {
  const {
    task,
    isComplete,
    completeTask,
    uncompleteTask,
    deleteTask,
    deleteCompletedTask
  } = props;
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <EditTask task={task} mode="div" />
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
      <div
        onClick={() => completeTask(task.id)}
        className="popover-control-item"
      >
        <span>Complete</span>
        <CheckCircleTwoTone twoToneColor="#52c41a" />
      </div>
      <Popconfirm
        title="Deleting Task also deletes its child tasks. Are you sure?"
        okText="Yes"
        cancelText="No"
        onConfirm={() => deleteTask(task.id)}
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
};

const getDueDateTime = (task: Task) => {
  if (task.recurrenceRule) {
    return (
      <div className="project-item-time">
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
      <div className="project-item-time">
        {task.dueDate} {task.dueTime}
      </div>
    </Tooltip>
  );
};

const TaskItem: React.FC<ProjectProps & TaskProps> = props => {
  const getTaskIcon = (task: Task) => {
    if (task.labels && task.labels[0]) {
      const icon = task.labels[0].icon;
      return getIcon(icon);
    }

    return <CarryOutOutlined />;
  };

  const getIcon = (icon: string) => {
    const res = icons.filter(item => item.name === icon);
    return res.length > 0 ? res[0].icon : <TagOutlined />;
  };

  const getMore = () => {
    if (props.readOnly) {
      return null;
    }
    return <Popover
        arrowPointAtCenter
        placement="rightTop"
        overlayStyle={{ width: '150px' }}
        content={
          <ManageTask
              task={task}
              isComplete={isComplete}
              completeTask={completeTask}
              uncompleteTask={uncompleteTask}
              deleteTask={deleteTask}
              deleteCompletedTask={deleteCompletedTask}
          />
        }
        trigger="click"
    >
          <span className="project-control-more">
            <MoreOutlined />
          </span>
    </Popover>
  };

  const {
    task,
    isComplete,
    completeTask,
    uncompleteTask,
    deleteTask,
    deleteCompletedTask
  } = props;

  const taskStyle = isComplete
    ? 'project-item-name completed-task'
    : 'project-item-name';
  // TODO: if readOnly, link to public item page
  // TODO: if isComplete, go to completedTask page
  let taskLink = `/task/${task.id}`;
  if (props.readOnly) {
    taskLink = `/api/public/items/TASK${task.id}`;
  } else if (isComplete) {
    taskLink = `/completedTasks/${task.id}`;
  }
  return (
    <div className="project-item">
      <div className="project-item-content">
        <Link to={taskLink}>
          <h3 className={taskStyle}>
            {getTaskIcon(task)} {task.name}
          </h3>
        </Link>
        <div className="project-item-subs">
          <div className="project-item-labels">
            {task.labels &&
              task.labels.map(label => {
                return (
                  <Tag
                    key={`label${label.id}`}
                    className="labels"
                    color={stringToRGB(label.value)}
                    style={{ borderRadius: 10 }}
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

      <div className="project-control">
        <div className="project-item-owner">
          <Tooltip title={`Created by ${task.owner}`}>
            <Avatar src={task.ownerAvatar} size="small" />
          </Tooltip>
        </div>
        <div className="project-item-assignee">
          <Tooltip title={`Assignee ${task.assignedTo}`}>
            <Avatar src={task.assignedToAvatar} size="small" />
          </Tooltip>
        </div>
        <div className="project-item-assignee">
          <Tooltip title={getReminderSettingString(task.reminderSetting)}>
            <AlertOutlined />
          </Tooltip>
        </div>
        {getMore()}
      </div>
    </div>
  );
};

export default connect(null, {
  completeTask,
  uncompleteTask,
  deleteTask,
  deleteCompletedTask
})(TaskItem);
