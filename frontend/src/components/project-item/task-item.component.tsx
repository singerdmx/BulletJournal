import React from 'react';
import { Popconfirm, Popover } from 'antd';
import {
  DeleteTwoTone,
  CheckCircleTwoTone,
  CloseCircleOutlined,
  FileDoneOutlined,
  InfoCircleOutlined,
  MessageOutlined,
  MoreOutlined
} from '@ant-design/icons';
import { Task } from '../../features/tasks/interface';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { completeTask, uncompleteTask, deleteTask, deleteCompletedTask } from '../../features/tasks/actions';
import './project-item.styles.less';


type TaskProps = {
  task: Task;
  isComplete: boolean;
  completeTask: (taskId: number) => void;
  uncompleteTask: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  deleteCompletedTask: (taskId: number) => void;
};

const ManageTask: React.FC<TaskProps> = props => {
  const { task, isComplete, completeTask, uncompleteTask, deleteTask, deleteCompletedTask } = props;
  if (isComplete) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Popconfirm
          title="Deleting Task also deletes its child tasks. Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteCompletedTask(task.id)}
          className="group-setting"
          placement="bottom"
        >
          <div style={{ cursor: 'pointer' }}>
            Delete
            <DeleteTwoTone twoToneColor="#f5222d" />
          </div>
        </Popconfirm>
        <div style={{ cursor: 'pointer' }}>
          Uncomplete
            <CloseCircleOutlined onClick={() => uncompleteTask(task.id)} twoToneColor="#52c41a" />
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Popconfirm
          title="Deleting Task also deletes its child tasks. Are you sure?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => deleteTask(task.id)}
          className="group-setting"
          placement="bottom"
        >
          <div style={{ cursor: 'pointer' }}>
            Delete
            <DeleteTwoTone twoToneColor="#f5222d" />
          </div>
        </Popconfirm>
        <div style={{ cursor: 'pointer' }}>
          Complete
          <CheckCircleTwoTone onClick={() => completeTask(task.id)} twoToneColor="#52c41a" />
        </div>
      </div>
    );
  }
};

const alignConfig = {
  offset: [10, -5]
};

const TaskItem: React.FC<TaskProps> = props => {
  const { task, isComplete, completeTask, uncompleteTask, deleteTask, deleteCompletedTask } = props;
  return (
    <div
      style={{
        width: '100%',
        height: '2rem',
        position: 'relative',
        lineHeight: '2rem'
      }}
    >
      <Link to={`/task/${task.id}`}>
        <FileDoneOutlined />
        <span style={{ padding: '0 5px', height: '100%' }}>{task.name}</span>
      </Link>
      <div
        style={{
          width: '300px',
          height: '100%',
          position: 'absolute',
          top: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'center'
        }}
      >
        <InfoCircleOutlined style={{ marginRight: '1em' }} />
        <MessageOutlined style={{ marginRight: '1em' }} />
        <Popover
          align={alignConfig}
          placement="bottomRight"
          style={{ top: -10 }}
          content={
            <ManageTask task={task} isComplete={isComplete} completeTask={completeTask} uncompleteTask={uncompleteTask} deleteTask={deleteTask} deleteCompletedTask={deleteCompletedTask} />
          }
          trigger="click"
        >
          <MoreOutlined
            style={{ transform: 'rotate(90deg)', fontSize: '20px' }}
          />
        </Popover>
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

