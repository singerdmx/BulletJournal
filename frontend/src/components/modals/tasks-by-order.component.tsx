import React, { useState } from 'react';
import { Modal, Empty, DatePicker, Divider, Button } from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import TaskItem from '../project-item/task-item.component';
import moment from 'moment';
import { Task } from '../../features/tasks/interface';
import { dateFormat } from '../../features/myBuJo/constants';
import { getTasksByOrder } from '../../features/tasks/actions';
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
};

const TasksByOrder: React.FC<TasksByOrderProps> = (props) => {
  const { visible, tasksByOrder, projectId, timezone, getTasksByOrder } = props;
  const [dateArray, setDateArray] = useState(['', '']);
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
        <RangePicker
          ranges={{
            Today: [moment(), moment()],
            'This Week': [moment().startOf('week'), moment().endOf('week')],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
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
        <span style={{ paddingLeft: '130px' }}>
          <Button type='primary' onClick={handleUpdate}>
            Update
          </Button>
        </span>
        <Divider />
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
      </div>
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  tasksByOrder: state.task.tasksByOrder,
  timezone: state.settings.timezone,
});

export default connect(mapStateToProps, { getTasksByOrder })(TasksByOrder);
