import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  Tooltip,
  Form,
  DatePicker,
  TimePicker,
  Select,
  Avatar,
  AutoComplete,
  Radio,
  Popover,
  Button
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
import ReactRRuleGenerator from '../../features/recurrence/RRuleGenerator';
import { ReminderBeforeTaskText } from '../settings/reducer';
const { Option } = Select;
const currentZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const currentCountry = currentZone && currentZone.split('/')[0];
zones.sort((a, b) => {
  if (currentZone && currentZone === a) {
    return -1;
  }
  if (
    currentCountry &&
    a.includes(currentCountry) &&
    !b.includes(currentCountry)
  ) {
    return -1;
  }
  return 0;
});

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
  before: string;
}

const AddTask: React.FC<RouteComponentProps &
  TaskProps &
  TaskCreateFormProps> = props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [dueType, setDueType] = useState(false);
  const [reminderType, setReminderType] = useState(false);
  const [dueTimeVisible, setDueTimeVisible] = useState(false);
  const [reminderTimeVisible, setReminderTimeVisible] = useState(false);
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

            <Radio.Group defaultValue={0}>
              <Radio value={0} onChange={() => setDueType(false)}>
                <div style={{ display: 'flex' }}>
                  <Tooltip title='Select Due Date'>
                    <Form.Item name='DueDate'>
                      <DatePicker
                        allowClear={true}
                        placeholder='Select Date'
                        disabled={dueType}
                        onChange={value => {
                          if (value === null) {
                            setDueTimeVisible(false);
                          } else {
                            setDueTimeVisible(true);
                          }
                        }}
                      />
                    </Form.Item>
                  </Tooltip>

                  <div
                    style={{
                      display: dueTimeVisible ? 'flex' : 'none'
                    }}
                  >
                    <Tooltip title='Select Due Time'>
                      <Form.Item name='DueTime' style={{ width: '100px' }}>
                        <TimePicker
                          allowClear={true}
                          format='HH:mm'
                          placeholder='Select Time'
                          disabled={dueType}
                        />
                      </Form.Item>
                    </Tooltip>
                  </div>
                </div>
              </Radio>
              <Radio value={1} onChange={() => setDueType(true)}>
                <Form.Item>
                  <Popover
                    content={<ReactRRuleGenerator />}
                    title='Recurrence'
                    trigger='click'
                  >
                    <Button type='default' disabled={!dueType}>
                      Recurrence
                    </Button>
                  </Popover>
                </Form.Item>
              </Radio>
            </Radio.Group>

            <div style={{ display: 'flex' }}>
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
                          {<span>{zone}</span>}
                        </Tooltip>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Tooltip>
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

            <span>Reminder</span>
            <Radio.Group defaultValue={0}>
              <Radio value={0} onChange={() => setReminderType(false)}>
                <Form.Item name='remindBefore'>
                  <Select
                    defaultValue={ReminderBeforeTaskText[0]}
                    disabled={reminderType}
                    style={{ width: '180px' }}
                    placeholder='Reminder Before Task'
                  >
                    {ReminderBeforeTaskText.map(
                      (before: string, index: number) => (
                        <Option key={index} value={before}>
                          {before}
                        </Option>
                      )
                    )}
                  </Select>
                </Form.Item>
              </Radio>
              <Radio value={1} onChange={() => setReminderType(true)}>
                <div style={{ display: 'flex' }}>
                  <Tooltip title='Reminder Date'>
                    <Form.Item name='reminderDate'>
                      <DatePicker
                        placeholder='Date'
                        disabled={!reminderType}
                        allowClear={true}
                        onChange={value => {
                          if (value === null) {
                            setReminderTimeVisible(false);
                          } else {
                            setReminderTimeVisible(true);
                          }
                        }}
                      />
                    </Form.Item>
                  </Tooltip>
                  <div
                    style={{
                      display: reminderTimeVisible ? 'flex' : 'none'
                    }}
                  >
                    <Tooltip title='Reminder Time'>
                      <Form.Item name='reminderTime' style={{ width: '100px' }}>
                        <TimePicker
                          allowClear={true}
                          format='HH:mm'
                          placeholder='Time'
                          disabled={!reminderType}
                        />
                      </Form.Item>
                    </Tooltip>
                  </div>
                </div>
              </Radio>
            </Radio.Group>
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
  myself: state.myself.username,
  before: state.settings.before
});

export default connect(mapStateToProps, { createTask, updateExpandedMyself })(
  withRouter(AddTask)
);
