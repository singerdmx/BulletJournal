import React, { useEffect } from 'react';
import {List, Divider, Tree, Empty} from 'antd';
import { Task } from '../../features/tasks/interface';
import TreeItem from '../../components/project-item/task-item.component';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import {
  putTask,
  updateTasks,
  updateCompletedTasks
} from '../../features/tasks/actions';
import { connect } from 'react-redux';
import { IState } from '../../store';

type TasksProps = {
  showCompletedTask: boolean;
  readOnly: boolean;
  projectId: number;
  tasks: Task[];
  completedTasks: Task[];
  updateTasks: (projectId: number) => void;
  updateCompletedTasks: (projectId: number) => void;
  putTask: (projectId: number, tasks: Task[]) => void;
};

const getTree = (data: Task[], readOnly: boolean): TreeNodeNormal[] => {
  let res = [] as TreeNodeNormal[];
  data.forEach((item: Task) => {
    const node = {} as TreeNodeNormal;
    if (item.subTasks && item.subTasks.length) {
      node.children = getTree(item.subTasks, readOnly);
    } else {
      node.children = [] as TreeNodeNormal[];
    }

    node.title = <TreeItem task={item} isComplete={false} readOnly={readOnly} completeOnyOccurrence={false}/>;
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
  const searchTask = tasks.find(item => item.id === taskId);
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
    const dragIndex = tasks.findIndex(task => task.id === targetTask.id);
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

const TaskTree: React.FC<TasksProps> = props => {
  const {
    projectId,
    readOnly,
    tasks,
    completedTasks,
    updateTasks,
    updateCompletedTasks,
    putTask
  } = props;

  useEffect(() => {
    if (projectId) {
      updateTasks(projectId);
      updateCompletedTasks(projectId);
    }
  }, [projectId]);
  let treeTask = getTree(tasks, readOnly);

  let completedTaskList = null;
  if (props.showCompletedTask) {
    if (completedTasks.length === 0) {
      completedTaskList =  <div>
        <Divider/><Empty/>
      </div>;
    } else {
      completedTaskList =
          <div>
            <Divider/>
            <div className='completed-tasks'>
              <List>
                {completedTasks.map(task => {
                  return (
                      <List.Item key={task.id}>
                        <TreeItem task={task} isComplete={true} readOnly={readOnly} completeOnyOccurrence={false}/>
                      </List.Item>
                  );
                })}
              </List>
            </div>
          </div>;
    }
  }
  return (
    <div>
      <Tree
        className='ant-tree'
        draggable
        blockNode
        onDragEnter={onDragEnter}
        onDrop={onDrop(tasks, putTask, projectId)}
        treeData={treeTask}
      />
      {completedTaskList}
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  projectId: state.project.project.id,
  tasks: state.task.tasks,
  completedTasks: state.task.completedTasks
});

export default connect(mapStateToProps, {
  updateTasks,
  updateCompletedTasks,
  putTask
})(TaskTree);
