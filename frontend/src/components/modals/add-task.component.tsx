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
  before: number;
}

const AddTask: React.FC<RouteComponentProps &
  TaskProps &
  TaskCreateFormProps> = props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [dueType, setDueType] = useState('dueByTime');
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
    <Tooltip placement="top" title="Create New Task">
      <div className="add-task">
        <PlusOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={openModal}
          title="Create New Task"
        />
        <Modal
          title="Create New Task"
          visible={visible}
          okText="Create"
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
          <Form form={form} layout="vertical">
            {/* form for name */}
            <Form.Item
              name="taskName"
              label="Name"
              rules={[{ required: true, message: 'Missing Task Name!' }]}
            >
              <Input placeholder="Enter Task Name" allowClear />
            </Form.Item>
            {/* form for Assignee */}
            <Form.Item name="assignee" label="Assignee">
              {props.group.users && (
                <Select defaultValue={props.myself} style={{ width: '100%' }}>
                  {props.group.users.map(user => {
                    return (
                      <Option value={user.name} key={user.name}>
                        <Avatar size="small" src={user.avatar} />
                        &nbsp;&nbsp; <strong>{user.name}</strong>
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
            {/* due type */}
            <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>Due Methods : </span>
            <Radio.Group
              defaultValue={'dueByTime'}
              onChange={e => setDueType(e.target.value)}
              buttonStyle="solid"
              style={{ marginBottom: 18 }}
            >
              <Radio.Button value={'dueByTime'}>Date (Time)</Radio.Button>
              <Radio.Button value={'dueByRec'}>Recurrence</Radio.Button>
            </Radio.Group>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', flex: 1 }}>
                <Tooltip title="Select Due Date">
                  <Form.Item name="DueDate" style={{ width: '100%' }}>
                    <DatePicker
                      allowClear={true}
                      style={{ width: '100%' }}
                      placeholder="Select Date"
                      disabled={dueType !== 'dueByTime'}
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
                {dueTimeVisible && (
                  <Tooltip title="Select Due Time">
                    <Form.Item name="DueTime" style={{ width: '100px' }}>
                      <TimePicker
                        allowClear={true}
                        format="HH:mm"
                        placeholder="Select Time"
                        disabled={dueType !== 'dueByTime'}
                      />
                    </Form.Item>
                  </Tooltip>
                )}
              </div>
              <Form.Item style={{ flex: 1 }}>
                <Popover
                  content={<ReactRRuleGenerator />}
                  title="Recurrence"
                  trigger="click"
                >
                  <Button type="default" disabled={dueType !== 'dueByRec'}>
                    Recurrence
                  </Button>
                </Popover>
              </Form.Item>
            </div>
            <Form.Item label="Timezone & Duration">
              <Tooltip title="Time Zone">
                <Form.Item
                  name="timezone"
                  style={{ display: 'inline-block', width: '70%' }}
                >
                  <Select
                    showSearch={true}
                    placeholder="Select Time Zone"
                    defaultValue={props.timezone ? props.timezone : ''}
                  >
                    {zones.map((zone: string, index: number) => (
                      <Option key={zone} value={zone}>
                        <Tooltip title={zone} placement="right">
                          {<span>{zone}</span>}
                        </Tooltip>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Tooltip>
              <Form.Item
                name="duration"
                rules={[{ pattern: /^[0-9]*$/, message: 'Invalid Duration' }]}
                style={{ display: 'inline-block', width: '30%' }}
              >
                <AutoComplete
                  placeholder="Duration"
                  style={{ display: 'inline' }}
                >
                  {children}
                </AutoComplete>
                <span>Min</span>
              </Form.Item>
            </Form.Item>

            <span>Reminder</span>
            <Radio.Group defaultValue={0}>
              <Radio value={0} onChange={() => setReminderType(false)}>
                <Form.Item name="remindBefore">
                  <Select
                    defaultValue={ReminderBeforeTaskText[0]}
                    disabled={reminderType}
                    style={{ width: '180px' }}
                    placeholder="Reminder Before Task"
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
                  <Tooltip title="Reminder Date">
                    <Form.Item name="reminderDate">
                      <DatePicker
                        placeholder="Date"
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
                    <Tooltip title="Reminder Time">
                      <Form.Item name="reminderTime" style={{ width: '100px' }}>
                        <TimePicker
                          allowClear={true}
                          format="HH:mm"
                          placeholder="Time"
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
