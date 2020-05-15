import React from 'react';
import { Modal, Empty } from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import TaskItem from '../project-item/task-item.component';
import { Task } from '../../features/tasks/interface';

type TasksByOrderProps = {
  tasksByOrder: Task[];
  visible: boolean;
  onCancel: () => void;
};

const TasksByOrder: React.FC<TasksByOrderProps> = (props) => {
  const { visible, tasksByOrder } = props;
  return (
    <Modal
      title={'Task(s) ordered by due date time'}
      visible={visible}
      onCancel={props.onCancel}
      footer={false}
    >
      {tasksByOrder.length === 0 ? (
        <Empty />
      ) : (
        tasksByOrder.map((task, index) => {
          return (
            <div key={index}>
              <TaskItem
                task={task}
                readOnly={false}
                inProject={false}
                inModal={true}
                isComplete={false}
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
  tasksByOrder: state.task.tasksByOrder,
});

export default connect(mapStateToProps, {})(TasksByOrder);
