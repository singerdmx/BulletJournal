import React, { useState } from 'react';
import { Modal, Empty, Tooltip, Checkbox, message } from 'antd';
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
import { deleteTasks } from '../../features/tasks/actions';
import { Project } from '../../features/project/interface';

type TasksByAssigneeProps = {
  project: Project | undefined;
  tasksByAssignee: Task[];
  visible: boolean;
  assignee: User | undefined;
  onCancel: () => void;
  deleteTasks: (projectId: number, tasksId: number[]) => void;
};

const TasksByAssignee: React.FC<TasksByAssigneeProps> = (props) => {
  const { project, visible, assignee, tasksByAssignee, deleteTasks } = props;
  const [checkboxVisible, setCheckboxVisible] = useState(false);
  const [checked, setChecked] = useState([] as number[]);
  const onCheck = (id: number) => {
    if (checked.includes(id)) {
      setChecked(checked.filter((c) => c !== id));
      return;
    }

    setChecked(checked.concat([id]));
  };

  const getList = () => {
    return tasksByAssignee.map((task, index) => {
      return (
        <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
          {checkboxVisible && (
            <Checkbox
              checked={checked.includes(task.id)}
              key={task.id}
              style={{ marginRight: '0.5rem', marginTop: '-0.5em' }}
              onChange={(e) => onCheck(task.id)}
            />
          )}
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

  const selectAll = () => {
    setCheckboxVisible(true);
    setChecked(tasksByAssignee.map((task) => task.id));
  };

  const clearAll = () => {
    setCheckboxVisible(true);
    setChecked([]);
  };

  const completeAll = () => {
    setCheckboxVisible(true);
    if (checked.length === 0) {
      message.error('No Selection');
      return;
    }
  };

  const deleteAll = () => {
    if (project === undefined) {
      return;
    }

    setCheckboxVisible(true);
    if (checked.length === 0) {
      message.error('No Selection');
      return;
    } else {
      deleteTasks(project.id, checked);
      setChecked([] as number[]);
    }
  };

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
          <div className='checkbox-actions'>
            <Tooltip title='Select All'>
              <CheckSquareTwoTone onClick={selectAll} />
            </Tooltip>
            <Tooltip title='Clear All'>
              <CloseSquareTwoTone onClick={clearAll} />
            </Tooltip>
            <Tooltip title='Complete All'>
              <CheckCircleTwoTone
                twoToneColor='#52c41a'
                onClick={completeAll}
              />
            </Tooltip>
            <Tooltip title='Delete All'>
              <DeleteTwoTone twoToneColor='#f5222d' onClick={deleteAll} />
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
  project: state.project.project,
});

export default connect(mapStateToProps, { deleteTasks })(TasksByAssignee);
