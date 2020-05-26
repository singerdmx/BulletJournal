import React from 'react';
import { Modal, Empty, Tooltip, Checkbox } from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import TaskItem from '../project-item/task-item.component';
import { Task } from '../../features/tasks/interface';
import { User } from '../../features/group/interface';
import {
  CheckSquareTwoTone,
  CloseSquareTwoTone,
  CheckCircleTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons';

type TasksByAssigneeProps = {
  tasksByAssignee: Task[];
  visible: boolean;
  assignee: User | undefined;
  onCancel: () => void;
};

const TasksByAssignee: React.FC<TasksByAssigneeProps> = (props) => {
  const { visible, assignee, tasksByAssignee } = props;

  const getList = () => {
    return tasksByAssignee.map((task, index) => {
      return (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          <Checkbox key={task.id} style={{ marginRight: '0.5rem' }} />
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
    });
  };

  const selectAll = () => {};

  const clearAll = () => {};

  const completeAll = () => {};

  const deleteAll = () => {};

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
        <div>
          <div className="checkbox-actions">
            <Tooltip title="Select All">
              <CheckSquareTwoTone onClick={selectAll} />
            </Tooltip>
            <Tooltip title="Clear All">
              <CloseSquareTwoTone onClick={clearAll} />
            </Tooltip>
            <Tooltip title="Complete All">
              <CheckCircleTwoTone
                twoToneColor="#52c41a"
                onClick={completeAll}
              />
            </Tooltip>
            <Tooltip title="Delete All">
              <DeleteTwoTone twoToneColor="#f5222d" onClick={deleteAll} />
            </Tooltip>
          </div>
          <div>{getList()}</div>
        </div>
      )}
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  tasksByAssignee: state.task.tasksByAssignee,
});

export default connect(mapStateToProps, {})(TasksByAssignee);
