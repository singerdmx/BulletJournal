import React, { useEffect } from 'react';

import './task-status.styles.less';
import { useHistory, useParams } from 'react-router-dom';
import { BackTop, Collapse, Tooltip } from 'antd';
import {
  CaretRightOutlined,
  SyncOutlined,
  UpSquareOutlined,
} from '@ant-design/icons';
import { IState } from '../../store';
import { getTasksByOrder } from '../../features/tasks/actions';
import { connect } from 'react-redux';
import { Task, TaskStatus } from '../../features/tasks/interface';
import { ProjectItemUIType } from '../../features/project/constants';
import TaskItem from '../../components/project-item/task-item.component';

const { Panel } = Collapse;

type TaskStatusProps = {
  timezone: string;
  tasksByOrder: Task[];
  getTasksByOrder: (
    projectId: number,
    timezone: string,
    startDate?: string,
    endDate?: string
  ) => void;
};

const TaskStatusPage: React.FC<TaskStatusProps> = ({
  getTasksByOrder,
  timezone,
  tasksByOrder,
}) => {
  const { projectId } = useParams();
  const history = useHistory();

  const getTasksByStatus = () => {
    if (!projectId) {
      return;
    }
    getTasksByOrder(parseInt(projectId), timezone, undefined, undefined);
  };

  useEffect(() => {
    getTasksByStatus();
  }, [projectId]);

  useEffect(() => {
    document.title = 'Bullet Journal - Tasks by Status';
  }, []);

  const inProgressTasks = [] as Task[];
  const nextToDoTasks = [] as Task[];
  const readyTasks = [] as Task[];
  const onHoldTasks = [] as Task[];
  const tasks = [] as Task[];
  tasksByOrder.forEach((t) => {
    switch (t.status) {
      case TaskStatus.IN_PROGRESS:
        inProgressTasks.push(t);
        break;
      case TaskStatus.NEXT_TO_DO:
        nextToDoTasks.push(t);
        break;
      case TaskStatus.READY:
        readyTasks.push(t);
        break;
      case TaskStatus.ON_HOLD:
        onHoldTasks.push(t);
        break;
      default:
        tasks.push(t);
    }
  });

  const getPanel = (status: TaskStatus | undefined, tasks: Task[]) => {
    if (tasks.length === 0) {
      return null;
    }
    let header = '';
    let key = 'DEFAULT';
    if (status) {
      header = status.toString().replace(/_/g, ' ');
      key = status.toString();
    }

    return (
      <Panel header={header} key={key}>
        {tasks.map((task, index) => {
          return (
            <div
              key={task.id}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <TaskItem
                task={task}
                type={ProjectItemUIType.ORDER}
                readOnly={false}
                inProject={false}
                inModal={false}
                isComplete={false}
                completeOnlyOccurrence={false}
              />
            </div>
          );
        })}
      </Panel>
    );
  };

  return (
    <div className="task-status-page">
      <BackTop />

      <div className="task-operation">
        <Tooltip title="Refresh">
          <span>
            <SyncOutlined onClick={getTasksByStatus} />
          </span>
        </Tooltip>
        <Tooltip title="Go to BuJo">
          <span>
            <UpSquareOutlined
              onClick={(e) => history.push(`/projects/${projectId}`)}
            />
          </span>
        </Tooltip>
      </div>
      <div>
        <Collapse
          bordered={false}
          defaultActiveKey={[
            'IN_PROGRESS',
            'NEXT_TO_DO',
            'READY',
            'ON_HOLD',
            'DEFAULT',
          ]}
          expandIcon={({ isActive }) => (
            <CaretRightOutlined rotate={isActive ? 90 : 0} />
          )}
        >
          {getPanel(TaskStatus.IN_PROGRESS, inProgressTasks)}
          {getPanel(TaskStatus.NEXT_TO_DO, nextToDoTasks)}
          {getPanel(TaskStatus.READY, readyTasks)}
          {getPanel(TaskStatus.ON_HOLD, onHoldTasks)}
          {getPanel(undefined, tasks)}
        </Collapse>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  timezone: state.settings.timezone,
  tasksByOrder: state.task.tasksByOrder,
});

export default connect(mapStateToProps, {
  getTasksByOrder,
})(TaskStatusPage);
