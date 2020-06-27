// page display contents of tasks
// react imports
import React, { useState, useEffect } from 'react';
// features
//actions
import {
  getReminderSettingString,
  Task,
  TaskStatus,
  getTaskBackgroundColor,
} from '../../features/tasks/interface';
// antd imports
import { Avatar, Divider, Tooltip, Select, Tag } from 'antd';
import { AlertOutlined, ClockCircleOutlined } from '@ant-design/icons';
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
//redux
import { IState } from '../../store';
import { connect } from 'react-redux';
//action
import { setTaskStatus } from '../../features/tasks/actions';
const { Option } = Select;

export type TaskProps = {
  task: Task | undefined;
  theme: string;
  contents: Content[];
  contentEditable?: boolean;
  setTaskStatus: (taskId: number, taskStatus: TaskStatus) => void;
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
    theme,
    labelEditable,
    taskOperation,
    createContentElem,
    taskEditorElem,
    contents,
    contentEditable,
    setTaskStatus,
  } = props;
  const [inputStatus, setInputStatus] = useState('' as TaskStatus);

  useEffect(() => {
    if (task) {
      setInputStatus(task.status);
    }
  }, [task]);

  const getDueDateTime = (task: Task) => {
    if (task.recurrenceRule) {
      const taskDue = convertToTextWithRRule(task.recurrenceRule);
      return (
        <Tooltip title={taskDue}>
          <Tag icon={<ClockCircleOutlined />}>{`Recurring: ${taskDue}`}</Tag>
        </Tooltip>
      );
    }

    if (!task.dueDate) {
      return null;
    }

    let dueDateTitle = moment(task.dueDate, dateFormat).fromNow();
    if (task.duration) {
      dueDateTitle += `, duration ${task.duration} minutes`;
    }

    const taskDue = `${task.dueDate} ${task.dueTime ? task.dueTime : ''}`;
    return (
      <Tooltip title={`Due ${taskDue}, ${dueDateTitle}`}>
        <Tag icon={<ClockCircleOutlined />}>{taskDue}</Tag>
      </Tooltip>
    );
  };

  const getReminder = (task: Task) => {
    const text = getReminderSettingString(task.reminderSetting);
    if (text === 'No Reminder') return null;
    return (
      <Tooltip title={text}>
        <Tag icon={<AlertOutlined />}>{text.replace('Reminder: ', '')}</Tag>
      </Tooltip>
    );
  };

  const getTaskStatusDropdown = (task: Task) => {
    if (createContentElem === null) {
      return null;
    }
    if (inputStatus) {
      return (
        <Select
          style={{ width: '135px' }}
          value={inputStatus}
          onChange={(value: TaskStatus) => {
            setInputStatus(value);
            setTaskStatus(task.id, value);
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
    }
    return (
      <Select
        style={{ width: '118px' }}
        placeholder='Set Status'
        onChange={(value: TaskStatus) => {
          setInputStatus(value);
          setTaskStatus(task.id, value);
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
        <div className='label-and-name'>{task.name}</div>
        {taskOperation()}
      </div>
      <div className='title-labels'>
        <DraggableLabelsList
          mode={ProjectType.TODO}
          labels={task.labels}
          editable={labelEditable}
          itemId={task.id}
        />
      </div>
      <Divider style={{ marginTop: '5px', marginBottom: '0px' }} />
      <div
        className='task-statistic-card'
        style={getTaskBackgroundColor(task.status, theme)}
      >
        {getDueDateTime(task)}
        {getReminder(task)}
        {getTaskStatusDropdown(task)}
      </div>
      <Divider style={{ marginTop: '0px' }} />
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

const mapStateToProps = (state: IState) => ({
  theme: state.myself.theme,
});

export default connect(mapStateToProps, {
  setTaskStatus,
})(TaskDetailPage);
