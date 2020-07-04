// page display contents of tasks
// react imports
import React from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
// features
//actions
import {
  getCompletedTask,
  updateCompleteTaskContents,
  uncompleteTask
} from '../../features/tasks/actions';
import { Tooltip } from 'antd';
import { UpSquareOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { IState } from '../../store';
// antd imports
import './task-page.styles.less';
import 'braft-editor/dist/index.css';
// components
import TaskDetailPage, { TaskProps } from './task-detail.pages';

// modals import

interface TaskPageHandler {
  getCompletedTask: (taskId: number) => void;
  updateCompleteTaskContents: (taskId: number) => void;
  uncompleteTask: (taskId: number) => void;
}

const CompletedTaskPage: React.FC<TaskPageHandler & TaskProps> = (props) => {
  const { task, contents, uncompleteTask } = props;
  // get id of task from router
  const { taskId } = useParams();
  // hook history in router
  const history = useHistory();
  // listening on the empty state working as componentDidmount
  React.useEffect(() => {
    taskId && props.getCompletedTask(parseInt(taskId));
  }, [taskId]);

  React.useEffect(() => {
    taskId && props.updateCompleteTaskContents(parseInt(taskId));
  }, [taskId]);
  if (!task) return null;
  const taskOperation = () => {
    return (
      <div className='task-operation'>
        <Tooltip title='Uncomplete Task'>
          <div>
            <CloseCircleOutlined
                twoToneColor='#52c41a'
                onClick={() => {
                  uncompleteTask(task.id);
                  history.push(`/projects/${task.projectId}`);
                }}/>
          </div>
        </Tooltip>
        <Tooltip title='Go to Parent BuJo'>
          <div>
            <UpSquareOutlined
              onClick={(e) => history.push(`/projects/${task.projectId}`)}
            />
          </div>
        </Tooltip>
      </div>
    );
  };

  return (
    <TaskDetailPage
      task={task}
      labelEditable={false}
      taskOperation={taskOperation}
      contents={contents}
      createContentElem={null}
      taskEditorElem={null}
      contentEditable={false}
    />
  );
};

const mapStateToProps = (state: IState) => ({
  task: state.task.task,
  contents: state.task.contents,
});

export default connect(mapStateToProps, {
  getCompletedTask,
  updateCompleteTaskContents,
  uncompleteTask
})(CompletedTaskPage);
