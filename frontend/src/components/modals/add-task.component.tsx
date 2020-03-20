import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  InputNumber,
  Tooltip,
  Form,
  DatePicker,
  TimePicker,
  Select,
  Avatar,
  AutoComplete
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { ReminderSetting } from '../../features/tasks/interface';
import { createTask } from '../../features/tasks/actions';
import { IState } from '../../store';
import './modals.styles.less';
import { zones } from '../settings/constants';
import { Group } from '../../features/group/interface';
import { updateExpandedMyself } from '../../features/myself/actions';
const { Option } = Select;

type TaskProps = {
  projectId: number;
  group: Group;
};

interface TaskCreateFormProps {
  createTask: (
    projectId: number,
    name: string,
    assignedTo: string,
    dueDate: string,
    dueTime: string,
    duration: number,
    reminderSetting: ReminderSetting,
    recurrenceRule: string
  ) => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
  timezone: string;
  myself: string;
}

const AddTask: React.FC<RouteComponentProps &
  TaskProps &
  TaskCreateFormProps> = props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const addTask = (values: any) => {
    // props.createTask(props.projectId, values.taskName);
    setVisible(false);
  };
  const onCancel = () => setVisible(false);
  const openModal = () => setVisible(true);
  useEffect(() => {
    props.updateExpandedMyself(true);
  }, []);
  const result = ['15', '30', '45', '60'];
  const children = result.map((option: string) => (
    <Option key={option} value={option}>
      {option}
    </Option>
  ));

  return (
    <Tooltip placement='top' title='Create New Task'>
      <div className='add-task'>
        <PlusOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={openModal}
          title='Create New Task'
        />
        <Modal
          title='Create New Task'
          visible={visible}
          okText='Create'
          onCancel={onCancel}
          onOk={() => {
            form
              .validateFields()
              .then(values => {
                console.log(values);
                form.resetFields();
                // addTask(values);
              })
              .catch(info => console.log(info));
          }}
        >
          <Form form={form} labelAlign='left'>
            <Form.Item
              name='taskName'
              label='Name'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              rules={[{ required: true, message: 'Missing Task Name!' }]}
            >
              <Input placeholder='Enter Task Name' allowClear />
            </Form.Item>

            <Form.Item
              name='assignee'
              label='Assignee'
              labelCol={{ span: 4 }}
              style={{ marginLeft: '10px' }}
              wrapperCol={{ span: 20 }}
            >
              {!props.group.users ? null : (
                <Select
                  defaultValue={props.myself}
                  style={{ marginLeft: '-8px' }}
                >
                  {props.group.users.map(user => {
                    return (
                      <Option value={user.name} key={user.name}>
                        <Avatar size='small' src={user.avatar} />
                        &nbsp;&nbsp; <strong>{user.name}</strong>
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>

            <div style={{ display: 'flex' }}>
              <Tooltip title='Select Due Date'>
                <Form.Item
                  name='date'
                  rules={[{ required: true, message: 'Missing Date!' }]}
                >
                  <DatePicker placeholder='Select Date' />
                </Form.Item>
              </Tooltip>
              <Tooltip title='Select Due Time'>
                <Form.Item name='time' style={{ width: '100px' }}>
                  <TimePicker
                    allowClear
                    format='HH:mm'
                    placeholder='Select Time'
                  />
                </Form.Item>
              </Tooltip>

              <Tooltip title='Time Zone'>
                <Form.Item name='timezone'>
                  <Select
                    showSearch={true}
                    placeholder='Select Time Zone'
                    defaultValue={props.timezone ? props.timezone : ''}
                  >
                    {zones.map((zone: string, index: number) => (
                      <Option key={zone} value={zone}>
                        <Tooltip title={zone} placement='right'>
                          {zone}
                        </Tooltip>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Tooltip>
            </div>

            <div style={{ display: 'flex' }}>
              <Form.Item
                name='duration'
                wrapperCol={{ span: 20 }}
                rules={[{ pattern: /^[0-9]*$/, message: 'Invalid Duration' }]}
              >
                <AutoComplete placeholder='Duration' style={{ width: 87 }}>
                  {children}
                </AutoComplete>
              </Form.Item>
              <span style={{ marginTop: '5px' }}>&nbsp;&nbsp;Minutes</span>
            </div>
          </Form>
        </Modal>
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state: IState) => ({
  projectId: state.project.project.id,
  timezone: state.settings.timezone,
  group: state.group.group,
  myself: state.myself.username
});

export default connect(mapStateToProps, { createTask, updateExpandedMyself })(
  withRouter(AddTask)
);
