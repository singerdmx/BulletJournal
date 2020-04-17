// page display contents of tasks
// react imports
import React from 'react';
import { useParams } from 'react-router-dom';
import { connect } from 'react-redux';
// features
//actions
import { getCompletedTask } from '../../features/tasks/actions';
import { IState } from '../../store';
// antd imports
import './task-page.styles.less';
import 'braft-editor/dist/index.css';
// components
import TaskDetailPage, { TaskProps } from './task-detail.pages';

// modals import

interface TaskPageHandler {
  getCompletedTask: (taskId: number) => void;
}

const CompletedTaskPage: React.FC<TaskPageHandler & TaskProps> = (props) => {
  const { task, contents } = props;
  // get id of task from router
  const { taskId } = useParams();
  // listening on the empty state working as componentDidmount
  React.useEffect(() => {
    taskId && props.getCompletedTask(parseInt(taskId));
  }, [taskId]);

  return (
    <TaskDetailPage
      task={task}
      labelEditable={false}
      taskOperation={() => null}
      contents={contents}
      createContentElem={null}
      taskEditorElem={null}
    />
  );
};

const mapStateToProps = (state: IState) => ({
  task: state.task.task,
  contents: state.task.contents,
});

export default connect(mapStateToProps, {
  getCompletedTask,
})(CompletedTaskPage);
