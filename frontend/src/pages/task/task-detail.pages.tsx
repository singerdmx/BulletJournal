// page display contents of tasks
// react imports
import React from 'react';
// features
//actions
import { getReminderSettingString, Task } from '../../features/tasks/interface';
// antd imports
import { Avatar, Card, Col, Divider, Row, Statistic, Tooltip } from 'antd';
import {
  AlertOutlined,
  FileDoneOutlined,
  ClockCircleOutlined,
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
import { StringNullableChain } from 'lodash';

export type TaskProps = {
  task: Task;
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

  const getDueDateTime = (task: Task) => {
    if (task.recurrenceRule) {
      return (
        <Col span={12}>
          <Card>
            <Statistic
              title='Recurring'
              value={convertToTextWithRRule(task.recurrenceRule)}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
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
      <Col span={12}>
        <Card>
          <Statistic
            title={`Due ${dueDateTitle}`}
            value={`${task.dueDate} ${task.dueTime ? task.dueTime : ''}`}
            prefix={<FileDoneOutlined />}
          />
        </Card>
      </Col>
    );
  };

  return (
    <div className='task-page'>
      <Tooltip
        placement='top'
        title={`Assignee ${task.assignedTo}`}
        className='task-avatar'
      >
        <span>
          <Avatar size='large' src={task.assignedToAvatar} />
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
        <Row gutter={10}>
          {getDueDateTime(task)}
          <Col span={12}>
            <Card>
              <Statistic
                title='Reminder'
                value={getReminderSettingString(task.reminderSetting)}
                prefix={<AlertOutlined />}
              />
            </Card>
          </Col>
        </Row>
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
