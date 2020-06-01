import React, { useState } from 'react';
import {
  Modal,
  Empty,
  DatePicker,
  Divider,
  Tooltip,
  Checkbox,
  message,
} from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import TaskItem from '../project-item/task-item.component';
import moment from 'moment';
import { Task } from '../../features/tasks/interface';
import { dateFormat } from '../../features/myBuJo/constants';
import { getTasksByOrder, deleteTasks } from '../../features/tasks/actions';
import {
  SyncOutlined,
  CloseSquareTwoTone,
  CheckCircleTwoTone,
  CheckSquareTwoTone,
  DeleteTwoTone,
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

type TasksByOrderProps = {
  projectId: number;
  timezone: string;
  tasksByOrder: Task[];
  visible: boolean;
  onCancel: () => void;
  getTasksByOrder: (
    projectId: number,
    timezone: string,
    startDate?: string,
    endDate?: string
  ) => void;
  deleteTasks: (projectId: number, tasksId: number[]) => void;
};

const TasksByOrder: React.FC<TasksByOrderProps> = (props) => {
  const {
    visible,
    tasksByOrder,
    projectId,
    timezone,
    getTasksByOrder,
    deleteTasks,
  } = props;
  const [dateArray, setDateArray] = useState(['', '']);
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
    return tasksByOrder.map((task, index) => {
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
            readOnly={false}
            inProject={false}
            inModal={true}
            isComplete={false}
            completeOnlyOccurrence={false}
          />
        </div>
      );
    });
  };

  const selectAll = () => {
    setCheckboxVisible(true);
    setChecked(tasksByOrder.map((task) => task.id));
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
    setCheckboxVisible(true);
    if (checked.length === 0) {
      message.error('No Selection');
      return;
    } else {
      deleteTasks(projectId, checked);
      setChecked([] as number[]);
    }
  };

  const handleRangeChange = (dates: any, dateStrings: string[]) => {
    setDateArray([dateStrings[0], dateStrings[1]]);
  };
  const handleUpdate = () => {
    getTasksByOrder(projectId, timezone, dateArray[0], dateArray[1]);
  };
  return (
    <Modal
      title={'Task(s) ordered by due date time'}
      visible={visible}
      onCancel={props.onCancel}
      footer={false}
    >
      <div>
        <div className='range-picker'>
          <RangePicker
            ranges={{
              Today: [moment(), moment()],
              'This Week': [moment().startOf('week'), moment().endOf('week')],
              'This Month': [
                moment().startOf('month'),
                moment().endOf('month'),
              ],
            }}
            value={
              dateArray[0] ? [moment(dateArray[0]), moment(dateArray[1])] : null
            }
            size='small'
            allowClear={true}
            format={dateFormat}
            placeholder={['Start Date', 'End Date']}
            onChange={handleRangeChange}
          />
          <span>
            <Tooltip title='Refresh'>
              <SyncOutlined onClick={handleUpdate} />
            </Tooltip>
          </span>
        </div>
        <Divider />
        {tasksByOrder.length === 0 ? (
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
      </div>
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  tasksByOrder: state.task.tasksByOrder,
  timezone: state.settings.timezone,
  project: state.project.project,
});

export default connect(mapStateToProps, { getTasksByOrder, deleteTasks })(
  TasksByOrder
);
