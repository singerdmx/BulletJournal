import React, {useEffect, useState} from 'react';

import './task-status.styles.less';
import {useHistory, useParams} from 'react-router-dom';
import {BackTop, Collapse} from 'antd';
import {CaretRightOutlined, SyncOutlined, UpSquareOutlined, FieldTimeOutlined} from '@ant-design/icons';
import {IState} from '../../store';
import {getTasksByAssignee, getTasksByOrder} from '../../features/tasks/actions';
import {connect} from 'react-redux';
import {Task, TaskStatus} from '../../features/tasks/interface';
import {ProjectItemUIType} from '../../features/project/constants';
import TaskItem from '../../components/project-item/task-item.component';
import TasksByAssignee from "../../components/modals/tasks-by-assignee.component";
import {User} from "../../features/group/interface";
import TasksByOrder from "../../components/modals/tasks-by-order.component";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {MenuOutlined} from "@ant-design/icons/lib";

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
  getTasksByAssignee: (projectId: number, assignee: string) => void;
};

const TaskStatusPage: React.FC<TaskStatusProps> = ({
  getTasksByOrder,
  timezone,
  tasksByOrder,
  getTasksByAssignee
}) => {
  const { projectId } = useParams();
  const history = useHistory();
  const [completeTasksShown, setCompleteTasksShown] = useState(false);
  const [tasksByUsersShown, setTasksByUsersShown] = useState(false);
  const [tasksByOrderShown, setTasksByOrderShown] = useState(false);
  const [assignee, setAssignee] = useState<User | undefined>(undefined);

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

  //by user modal
  const handleGetTasksByAssignee = (u: User) => {
    if (!projectId) {
      return;
    }
    setTasksByUsersShown(true);
    setAssignee(u);
    // update tasks
   getTasksByAssignee(parseInt(projectId), u.name);
  };

  const handleGetTasksByOrder = () => {
    if (!projectId) {
      return;
    }
    setTasksByOrderShown(true);
    getTasksByOrder(
        parseInt(projectId),
        timezone,
        undefined,
        undefined
    );
  };

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
                inProject={true}
                inModal={false}
                isComplete={false}
                showModal={handleGetTasksByAssignee}
                showOrderModal={handleGetTasksByOrder}
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
      <div>
        <TasksByAssignee
            assignee={assignee}
            visible={tasksByUsersShown}
            onCancel={() => setTasksByUsersShown(false)}
            hideCompletedTask={() => setCompleteTasksShown(false)}
        />
      </div>
      <div>
        <TasksByOrder
            visible={tasksByOrderShown}
            onCancel={() => setTasksByOrderShown(false)}
            hideCompletedTask={() => setCompleteTasksShown(false)}
        />
      </div>
      <div>
        <Container>
          <FloatButton
              onClick={() => history.push(`/projects/${projectId}`)}
              tooltip="Go to BuJo"
              styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
          >
            <UpSquareOutlined/>
          </FloatButton>
          <FloatButton
              tooltip="Tasks Ordered by Due Date Time"
              onClick={handleGetTasksByOrder}
              styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
          >
            <FieldTimeOutlined />
          </FloatButton>
          <FloatButton
              onClick={getTasksByStatus}
              tooltip="Refresh"
              styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
          >
            <SyncOutlined />
          </FloatButton>
          <FloatButton
              tooltip="Actions"
              styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
          >
            <MenuOutlined/>
          </FloatButton>
        </Container>
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
  getTasksByAssignee
})(TaskStatusPage);
