// page display contents of tasks
// react imports
import React, { useState, useEffect } from 'react';
// features
//actions
import {
  getReminderSettingString,
  Task,
  TaskStatus,
} from '../../features/tasks/interface';
// antd imports
import {
  Avatar,
  Card,
  Col,
  Divider,
  Row,
  Statistic,
  Tooltip,
  Select,
} from 'antd';
import {
  AlertOutlined,
  ClockCircleOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import './task-page.styles.less';
import 'braft-editor/dist/index.css';
import { ProjectType } from '../../features/project/constants';
import { convertToTextWithRRule } from '../../features/recurrence/actions';
import moment from 'moment';
import { dateFormat } from '../../features/myBuJo/constants';
import DraggableLabelsList from '../../components/draggable-labels/draggable-label-list.component';
import { Content } from '../../features/myBuJo/interface';
// components
import TaskContentList from '../../components/content/content-list.component';
const { Option } = Select;

export type TaskProps = {
  task: Task | undefined;
  contents: Content[];
  contentEditable?: boolean;
};

type TaskDetailProps = {
  labelEditable: boolean;
  taskOperation: Function;
  createContentElem: React.ReactNode;
  taskEditorElem: React.ReactNode;
};

const TaskDetailPage: React.FC<TaskProps & TaskDetailProps> = (props) => {
  const {
    task,
    labelEditable,
    taskOperation,
    createContentElem,
    taskEditorElem,
    contents,
    contentEditable,
  } = props;
  const [inputStatus, setInputStatus] = useState('');

  useEffect(() => {
    if (task && task.status) setInputStatus(task.status);
  }, [task]);

  const getDueDateTime = (task: Task) => {
    if (task.recurrenceRule) {
      return (
        <div>
          <Tooltip title='Recurring'>
            <ClockCircleOutlined />
          </Tooltip>
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
      <div>
        <Tooltip title={'due' + dueDateTitle}>
          <ClockCircleOutlined />
        </Tooltip>
        {`${task.dueDate} ${task.dueTime ? task.dueTime : ''}`}
      </div>
    );
  };

  const getRemind = (task: Task) => {
    return (
      <>
        <Tooltip title='Reminder'>
          <AlertOutlined />
        </Tooltip>
        <span>{getReminderSettingString(task.reminderSetting)}</span>
      </>
    );
  };

  const getTaskStatusDropdown = (task: Task) => {
    return (
      <Select
        style={{ width: '180px' }}
        value={inputStatus}
        onChange={(value) => {
          console.log(value);
          setInputStatus(value);
        }}
      >
        {Object.values(TaskStatus).map((s: string) => {
          return (
            <Option value={s} key={s}>
              {s.replace(/_/g, ' ')}
            </Option>
          );
        })}
      </Select>
    );
  };

  if (!task) return null;
  return (
    <div className='task-page'>
      <Tooltip
        placement='top'
        title={`Created by ${task.owner.alias}`}
        className='task-avatar'
      >
        <span>
          <Avatar size='large' src={task.owner.avatar} />
        </span>
      </Tooltip>
      <div className='task-title'>
        <div className='label-and-name'>
          {task.name}
          <DraggableLabelsList
            mode={ProjectType.TODO}
            labels={task.labels}
            editable={labelEditable}
            itemId={task.id}
          />
        </div>

        {taskOperation()}
      </div>
      <Divider />
      <div className='task-statistic-card'>
        {getTaskStatusDropdown(task)}
        {getDueDateTime(task)}
        {getRemind(task)}
      </div>
      <Divider />
      <div className='content'>
        <div className='content-list'>
          <TaskContentList
            projectItem={task}
            contents={contents}
            contentEditable={contentEditable}
          />
        </div>
        {createContentElem}
      </div>
      {taskEditorElem}
    </div>
  );
};

export default TaskDetailPage;
