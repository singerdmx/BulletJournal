import React, { useEffect } from 'react';
import {List, Divider, Tree, Empty, Tooltip, Button, Result} from 'antd';
import { Task } from '../../features/tasks/interface';
import TreeItem from '../../components/project-item/task-item.component';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import ReactLoading from 'react-loading';
import {
  putTask,
  updateTasks,
  updateCompletedTasks,
} from '../../features/tasks/actions';
import { connect } from 'react-redux';
import { IState } from '../../store';
import { Project } from '../../features/project/interface';
import { CloudSyncOutlined, SearchOutlined } from '@ant-design/icons';
import './task.styles.less';
import { User } from '../../features/group/interface';
import {useHistory} from "react-router-dom";
import AddTask from "../../components/modals/add-task.component";
import {
  CarryOutOutlined
} from '@ant-design/icons';

type TasksProps = {
  showCompletedTask: boolean;
  readOnly: boolean;
  project: Project | undefined;
  tasks: Task[];
  completedTasks: Task[];
  loadingCompletedTask: boolean;
  nextCompletedTasks: Task[];
  updateTasks: (projectId: number) => void;
  updateCompletedTasks: (projectId: number) => void;
  putTask: (projectId: number, tasks: Task[]) => void;
  showModal?: (user: User) => void;
};

const getTree = (
  inProject: boolean,
  data: Task[],
  readOnly: boolean,
  showModal?: (user: User) => void
): TreeNodeNormal[] => {
  let res = [] as TreeNodeNormal[];
  data.forEach((item: Task) => {
    const node = {} as TreeNodeNormal;
    if (item.subTasks && item.subTasks.length) {
      node.children = getTree(inProject, item.subTasks, readOnly, showModal);
    } else {
      node.children = [] as TreeNodeNormal[];
    }

    node.title = (
      <TreeItem
        task={item}
        isComplete={false}
        readOnly={readOnly}
        inProject={true}
        completeOnlyOccurrence={false}
        showModal={showModal}
      />
    );
    node.key = item.id.toString();
    res.push(node);
  });
  return res;
};

const onDragEnter = (info: any) => {
  // expandedKeys 需要受控时设置
  // setState({
  //   expendKey: info.expandedKeys,
  // });
};

const findTaskById = (tasks: Task[], taskId: number): Task => {
  let res = {} as Task;
  const searchTask = tasks.find((item) => item.id === taskId);
  if (searchTask) {
    res = searchTask;
  } else {
    for (let i = 0; i < tasks.length; i++) {
      const searchSubTask = findTaskById(tasks[i].subTasks, taskId);
      if (searchSubTask.id) {
        res = searchSubTask;
      }
    }
  }
  return res;
};

const dragTaskById = (tasks: Task[], taskId: number): Task[] => {
  let res = [] as Task[];
  tasks.forEach((item, index) => {
    let task = {} as Task;
    const subTasks = dragTaskById(item.subTasks, taskId);
    task = { ...item, subTasks: subTasks };
    if (task.id !== taskId) res.push(task);
  });
  return res;
};

const DropTaskById = (
  tasks: Task[],
  dropId: number,
  dropTask: Task
): Task[] => {
  let res = [] as Task[];
  tasks.forEach((item, index) => {
    let task = {} as Task;
    let subTasks = [] as Task[];
    if (item.id === dropId) {
      subTasks = item.subTasks;
      subTasks.push(dropTask);
    } else {
      subTasks = DropTaskById(item.subTasks, dropId, dropTask);
    }
    task = { ...item, subTasks: subTasks };
    res.push(task);
  });
  return res;
};

const onDrop = (tasks: Task[], putTask: Function, projectId: number) => (
  info: any
) => {
  const targetTask = findTaskById(tasks, parseInt(info.dragNode.key));
  const dropPos = info.node.props.pos.split('-');
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
  const dragTasks = dragTaskById(tasks, parseInt(info.dragNode.key));
  const droppingIndex = info.dropPosition + 1;
  let resTasks = [] as Task[];
  if (dropPosition === -1) {
    const dragIndex = tasks.findIndex((task) => task.id === targetTask.id);
    if (dragIndex >= droppingIndex) {
      dragTasks.splice(droppingIndex, 0, targetTask);
      resTasks = dragTasks;
    } else {
      dragTasks.splice(droppingIndex - 1, 0, targetTask);
      resTasks = dragTasks;
    }
  } else {
    resTasks = DropTaskById(dragTasks, parseInt(info.node.key), targetTask);
  }
  putTask(projectId, resTasks);
};

const Loading = () => (
  <div className='loading'>
    <ReactLoading type='bubbles' color='#0984e3' height='75' width='75' />
  </div>
);

const TaskTree: React.FC<TasksProps> = (props) => {
  const {
    project,
    readOnly,
    tasks,
    completedTasks,
    updateTasks,
    updateCompletedTasks,
    putTask,
    loadingCompletedTask,
    nextCompletedTasks,
    showModal,
  } = props;

  useEffect(() => {
    if (project) {
      updateTasks(project.id);
    }
  }, [project]);

  const history = useHistory();

  const handleLoadMore = () => {
    if (project) {
      updateCompletedTasks(project.id);
    }
  };

  const handleSearchCompletedTasksClick = () => {
    history.push('/completedTasks/search');
  };

  let completedTaskList = null;
  if (props.showCompletedTask) {
    if (completedTasks.length === 0) {
      completedTaskList = (
        <div>
          <Divider />
          <Empty />
        </div>
      );
    } else {
      completedTaskList = (
        <div>
          <Divider />
          <div className='search-completed-tasks-button'>
            <Button icon={<SearchOutlined />} onClick={handleSearchCompletedTasksClick}>Search Completed Tasks</Button>
          </div>
          <div className='completed-tasks'>
            <List>
              {completedTasks.map((task) => {
                return (
                  <List.Item key={task.id}>
                    <TreeItem
                      task={task}
                      isComplete={true}
                      readOnly={readOnly}
                      inProject={false}
                      completeOnlyOccurrence={false}
                    />
                  </List.Item>
                );
              })}
            </List>
          </div>
          {loadingCompletedTask ? (
            <Loading />
          ) : nextCompletedTasks.length === 0 ? null : (
            <span className='load-more-button' onClick={handleLoadMore}>
              <Tooltip title='Load More'>
                <CloudSyncOutlined />
              </Tooltip>
            </span>
          )}
        </div>
      );
    }
  }
  if (!project) {
    return null;
  }
  if (tasks.length === 0) {
    return <div className='add-task-button'>
      <Result
          icon={<CarryOutOutlined />}
          extra={<AddTask mode='button'/>}
      />
    </div>
  }

  const treeTask = getTree(!project.shared, tasks, readOnly, showModal);

  return (
    <div>
      <Tree
        className='ant-tree'
        draggable
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop(tasks, putTask, project.id)}
        treeData={treeTask}
      />
      {completedTaskList}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  tasks: state.task.tasks,
  completedTasks: state.task.completedTasks,
  loadingCompletedTask: state.task.loadingCompletedTask,
  nextCompletedTasks: state.task.nextCompletedTasks,
});

export default connect(mapStateToProps, {
  updateTasks,
  updateCompletedTasks,
  putTask,
})(TaskTree);
