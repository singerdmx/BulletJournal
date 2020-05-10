import React from 'react';
import { Modal, Empty } from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import TaskItem from '../project-item/task-item.component';
import { Task } from '../../features/tasks/interface';
import { User } from '../../features/group/interface';

type TasksByAssigneeProps = {
  tasksByAssignee: Task[];
  visible: boolean;
  assignee: User | undefined;
  onCancel: () => void;
};

const TasksByAssignee: React.FC<TasksByAssigneeProps> = (props) => {
  const { visible, assignee, tasksByAssignee } = props;
  return (
    <Modal
      title={`Assigned to ${assignee ? assignee.alias : ''}`}
      visible={visible}
      onCancel={props.onCancel}
      footer={false}
    >
      {tasksByAssignee.length === 0 ? (
        <Empty />
      ) : (
        tasksByAssignee.map((task, index) => {
          return (
            <div key={index}>
              <TaskItem
                task={task}
                isComplete={false}
                readOnly={false}
                inModal={true}
                inProject={false}
                completeOnlyOccurrence={false}
              />
            </div>
          );
        })
      )}
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  tasksByAssignee: state.task.tasksByAssignee,
});

export default connect(mapStateToProps, {})(TasksByAssignee);
