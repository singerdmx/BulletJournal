import React, {useEffect, useState} from 'react';

import './task-status.styles.less';
import {useHistory, useParams} from 'react-router-dom';
import {BackTop, Badge, Collapse} from 'antd';
import {CaretRightOutlined, FieldTimeOutlined, SyncOutlined, UpSquareOutlined} from '@ant-design/icons';
import {IState} from '../../store';
import {getTasksByAssignee, getTasksByOrder, setTaskStatus} from '../../features/tasks/actions';
import {connect} from 'react-redux';
import {Task, TaskStatus} from '../../features/tasks/interface';
import {ProjectItemUIType} from '../../features/project/constants';
import TaskItem from '../../components/project-item/task-item.component';
import TasksByAssignee from "../../components/modals/tasks-by-assignee.component";
import {User} from "../../features/group/interface";
import TasksByOrder from "../../components/modals/tasks-by-order.component";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {Project} from "../../features/project/interface";
import {DragDropContext, Draggable, Droppable} from "react-beautiful-dnd";
import {getProject} from "../../features/project/actions";

const {Panel} = Collapse;

type TaskStatusProps = {
  timezone: string;
  project: Project | undefined;
  tasksByOrder: Task[];
  getTasksByOrder: (
      projectId: number,
      timezone: string,
      startDate?: string,
      endDate?: string
  ) => void;
  getTasksByAssignee: (projectId: number, assignee: string) => void;
  setTaskStatus: (taskId: number, taskStatus: TaskStatus, type: ProjectItemUIType) => void;
  getProject: (projectId: number) => void;
};

const TaskStatusPage: React.FC<TaskStatusProps> = (
    {
      getTasksByOrder,
      project,
      timezone,
      tasksByOrder,
      getTasksByAssignee,
      setTaskStatus,
      getProject
    }) => {
  const {projectId} = useParams();
  const history = useHistory();
  const [initialized, setInitialized] = useState(false);
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
    if (!projectId) {
      return;
    }
    if (!project) {
      getProject(parseInt(projectId));
      return;
    }
    if (project && !initialized) {
      setInitialized(true);
      getTasksByStatus();
    }
  }, [project]);

  useEffect(() => {
    if (project) {
      document.title = project.name;
    } else {
      document.title = 'Bullet Journal - Tasks by Status';
    }
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
    let header = <Badge count={tasks.length} style={{backgroundColor: 'grey'}} title='Number of Tasks'/>;
    let key = 'DEFAULT';
    if (status) {
      header = <Badge count={tasks.length} style={{backgroundColor: 'grey'}} offset={[20, 6]} title='Number of Tasks'>
        <span>
          {status.toString().replace(/_/g, ' ')}
        </span>
      </Badge>;
      key = status.toString();
    }

    return (
        <Panel header={header} key={key}>
          <Droppable droppableId={`${key}`}>
            {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {tasks.map((task, index) => {
                    return (
                        <Draggable draggableId={`${task.id}`} index={index}>
                          {(provided) => (
                              <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  key={task.id}
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
                          )}
                        </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
            )}
          </Droppable>
        </Panel>
    );
  };

  const onDragEnd = (result: any) => {
    const {destination, draggableId} = result;
    if (!destination) {
      return;
    }
    console.log(destination);
    console.log(draggableId);
    const taskId = parseInt(draggableId);
    const newStatus = destination.droppableId;
    setTaskStatus(taskId, newStatus, ProjectItemUIType.ORDER);
  }

  return (
      <div className="task-status-page">
        <BackTop/>
        <div>
          <DragDropContext onDragEnd={onDragEnd}>
            <Collapse
                bordered={false}
                defaultActiveKey={[
                  'IN_PROGRESS',
                  'NEXT_TO_DO',
                  'READY',
                  'ON_HOLD',
                  'DEFAULT',
                ]}
                expandIcon={({isActive}) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0}/>
                )}
            >
              {getPanel(TaskStatus.IN_PROGRESS, inProgressTasks)}
              {getPanel(TaskStatus.NEXT_TO_DO, nextToDoTasks)}
              {getPanel(TaskStatus.READY, readyTasks)}
              {getPanel(TaskStatus.ON_HOLD, onHoldTasks)}
              {getPanel(undefined, tasks)}
            </Collapse>
          </DragDropContext>
        </div>
        <div>
          <TasksByAssignee
              assignee={assignee}
              visible={tasksByUsersShown}
              onCancel={() => setTasksByUsersShown(false)}
              hideCompletedTask={() => {
              }}
          />
        </div>
        <div>
          <TasksByOrder
              visible={tasksByOrderShown}
              onCancel={() => setTasksByOrderShown(false)}
              hideCompletedTask={() => {
              }}
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
                onClick={getTasksByStatus}
                tooltip="Refresh"
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
              <SyncOutlined/>
            </FloatButton>
            <FloatButton
                tooltip="Tasks Ordered by Due Date"
                onClick={handleGetTasksByOrder}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
              <FieldTimeOutlined/>
            </FloatButton>
          </Container>
        </div>
      </div>
  );
};

const mapStateToProps = (state: IState) => ({
  timezone: state.settings.timezone,
  tasksByOrder: state.task.tasksByOrder,
  project: state.project.project
});

export default connect(mapStateToProps, {
  getTasksByOrder,
  getTasksByAssignee,
  setTaskStatus,
  getProject
})(TaskStatusPage);
