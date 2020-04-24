import React, { useEffect, useState } from 'react';
import {
  AutoComplete,
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Popover,
  Radio,
  Select,
  TimePicker,
  Tooltip,
} from 'antd';
import { EditTwoTone, CheckSquareTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { patchTask } from '../../features/tasks/actions';
import { IState } from '../../store';
import './modals.styles.less';
import { zones } from '../settings/constants';
import { Group } from '../../features/group/interface';
import { updateExpandedMyself } from '../../features/myself/actions';
import ReactRRuleGenerator from '../../features/recurrence/RRuleGenerator';
import { ReminderBeforeTaskText } from '../settings/reducer';
import {
  convertToTextWithRRule,
  convertToTextWithTime,
} from '../../features/recurrence/actions';
import { ReminderSetting, Task } from '../../features/tasks/interface';
import { dateFormat } from '../../features/myBuJo/constants';
import moment from 'moment';

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
  mode: string;
  task: Task;
  projectId: number;
  group: Group;
};

interface TaskEditFormProps {
  patchTask: (
    taskId: number,
    timezone: string,
    name?: string,
    assignedTo?: string,
    assignees?: string[],
    dueDate?: string,
    dueTime?: string,
    duration?: number,
    reminderSetting?: ReminderSetting,
    recurrenceRule?: string
  ) => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
  convertToTextWithTime: (start: any, repeat: any, end: any) => string;
  timezone: string;
  start: any;
  repeat: any;
  end: any;
  myself: any;
  projectId: number;
  before: number;
  startTime: string;
  startDate: string;
  rRuleString: any;
}

const EditTask: React.FC<
  RouteComponentProps & TaskProps & TaskEditFormProps
> = (props) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [dueType, setDueType] = useState('dueByTime');
  const [reminderType, setReminderType] = useState('remindBefore');
  const [dueTimeVisible, setDueTimeVisible] = useState(false);
  const [reminderTimeVisible, setReminderTimeVisible] = useState(false);
  const [recurrenceVisible, setRecurrenceVisible] = useState(false);
  const [remindButton, setRemindButton] = useState('remindBefore');
  const [useTaskRecurrenceRule, setUseTaskRecurrenceRule] = useState(true);
  const rRuleText = useTaskRecurrenceRule
    ? props.task.recurrenceRule
      ? convertToTextWithRRule(props.task.recurrenceRule)
      : 'Recurrence'
    : convertToTextWithRRule(props.rRuleString);
  const rRuleTextList = rRuleText.match(
    /\b[\w,|\w-|\w:]+(?:\s+[\w,|\w-|\w:]+){0,5}/g
  );

  const updateTask = (values: any) => {
    const { task } = props;

    //convert time object to string
    let dueDate = values.dueDate
      ? values.dueDate.format(dateFormat)
      : task.dueDate;
    if (values.dueDate === null) {
      dueDate = undefined;
    }
    let dueTime = values.dueTime
      ? values.dueTime.format('HH:mm')
      : task.dueTime;
    if (values.dueTime === null) {
      dueTime = undefined;
    }
    let recurrence: string | undefined = useTaskRecurrenceRule
      ? props.task.recurrenceRule
      : props.rRuleString;
    if (dueType === 'dueByRec') {
      dueDate = undefined;
      dueTime = undefined;
    } else {
      recurrence = undefined;
    }
    const assignees = values.assignees ? values.assignees : undefined;
    const timezone = values.timezone ? values.timezone : task.timezone;
    let reminderSetting = {
      date: values.reminderDate
        ? values.reminderDate.format(dateFormat)
        : undefined,
      time: values.reminderTime
        ? values.reminderTime.format('HH:mm')
        : undefined,
      before:
        values.remindBefore === undefined ? props.before : values.remindBefore,
    } as ReminderSetting;
    if (reminderType === 'remindBefore') {
      reminderSetting.date = undefined;
      reminderSetting.time = undefined;
    } else {
      reminderSetting.before = undefined;
    }

    props.patchTask(
      task.id,
      timezone,
      values.taskName,
      assignees[0],
      assignees,
      dueDate,
      dueTime,
      values.duration,
      reminderSetting,
      recurrence
    );
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setVisible(false);
  };

  const openModal = () => {
    setVisible(true);
  };

  const selectAll = () => {
    form.setFields([{name: 'assignees', value:props.group.users.map((user) => user.name)}]);
  };

  useEffect(() => {
    const { task } = props;
    props.updateExpandedMyself(true);
    //initialize due type
    if (task.recurrenceRule) {
      setDueType('dueByRec');
    } else {
      setDueType('dueByTime');
    }
    //set due time
    if (task.dueTime) setDueTimeVisible(true);
    //set remind type
    if (task.reminderSetting && task.reminderSetting.date) {
      setRemindButton('reminderDate');
      setReminderType('reminderDate');
    } else {
      setRemindButton('remindBefore');
      setReminderType('remindBefore');
    }
    //set remind time
    if (task.reminderSetting && task.reminderSetting.time)
      setReminderTimeVisible(true);
  }, []);
  const result = ['15', '30', '45', '60'];
  const options = result.map((time: string) => {
    return { value: time };
  });

  const onClickRecurrenceButton = () => {
    setUseTaskRecurrenceRule(false);
  };

  const getModal = () => {
    const { task } = props;

    return (
      <Modal
        title='Edit Task'
        visible={visible}
        okText='Confirm'
        destroyOnClose
        onCancel={(e) => handleCancel(e)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values);
              form.resetFields();
              setVisible(!visible);
              updateTask(values);
            })
            .catch((info) => console.log(info));
        }}
      >
        <Form form={form} layout='vertical'>
          {/* form for name */}
          <Form.Item name='taskName' label='Name'>
            <Input
              placeholder='Enter Task Name'
              defaultValue={task.name ? task.name : ''}
            />
          </Form.Item>
          {/* form for Assignees */}
          <Form.Item name='assignees' label={
            <span>Assignees{' '}
              <Tooltip title='Select All'>
                <CheckSquareTwoTone
                    onClick={selectAll}
                    style={{cursor: 'pointer'}}/>
              </Tooltip>
              </span>
          }>
            {props.group.users && (
              <Select
                mode='multiple'
                defaultValue={task.assignedTo ? task.assignedTo : ''}
                style={{ width: '100%' }}
              >
                {props.group.users.map((user) => {
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
          {/* due type */}
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>Due&nbsp;&nbsp;</span>
          <Radio.Group
            value={dueType}
            onChange={(e) => setDueType(e.target.value)}
            buttonStyle='solid'
            style={{ marginBottom: 18 }}
          >
            <Radio value={'dueByTime'}>Date (Time)</Radio>
            <Radio
              value={'dueByRec'}
              onClick={() => {
                //force remind option to be before
                setRemindButton('remindBefore');
                setReminderType('remindBefore');
              }}
            >
              Recurrence
            </Radio>
          </Radio.Group>

          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', flex: 1 }}>
              <Tooltip title='Select Due Date' placement='bottom'>
                <Form.Item name='dueDate' style={{ width: '100%' }}>
                  <DatePicker
                    allowClear={true}
                    style={{ width: '100%' }}
                    placeholder='Due Date'
                    disabled={dueType !== 'dueByTime'}
                    onChange={(value) => setDueTimeVisible(value !== null)}
                    defaultValue={
                      task.dueDate
                        ? moment(task.dueDate, dateFormat)
                        : undefined
                    }
                  />
                </Form.Item>
              </Tooltip>
              {dueTimeVisible && (
                <Tooltip title='Select Due Time' placement='bottom'>
                  <Form.Item name='dueTime' style={{ width: '210px' }}>
                    <TimePicker
                      allowClear={true}
                      format='HH:mm'
                      placeholder='Due Time'
                      disabled={dueType !== 'dueByTime'}
                      defaultValue={
                        task.dueTime ? moment(task.dueTime, 'HH:mm') : undefined
                      }
                    />
                  </Form.Item>
                </Tooltip>
              )}
            </div>
            <Form.Item style={{ flex: 1 }}>
              <Tooltip title={rRuleText} placement='bottom'>
                <Popover
                  content={<ReactRRuleGenerator />}
                  title={
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.5em',
                      }}
                    >
                      <div className='recurrence-title'>
                        <div>{rRuleTextList && rRuleTextList[0]}</div>
                        {rRuleTextList &&
                          rRuleTextList.length > 1 &&
                          rRuleTextList
                            .slice(1)
                            .map((text, index) => (
                              <div key={index}>{text}</div>
                            ))}
                      </div>
                      <Button
                        onClick={() => setRecurrenceVisible(false)}
                        type='primary'
                      >
                        Done
                      </Button>
                    </div>
                  }
                  visible={recurrenceVisible && dueType === 'dueByRec'}
                  onVisibleChange={(visible) => {
                    setRecurrenceVisible(visible);
                  }}
                  trigger='click'
                  placement='top'
                >
                  <Button
                    type='default'
                    disabled={dueType !== 'dueByRec'}
                    onClick={onClickRecurrenceButton}
                  >
                    <p className='marquee'>{rRuleText}</p>
                  </Button>
                </Popover>
              </Tooltip>
            </Form.Item>
          </div>
          {/* timezone and duration */}
          <Form.Item label='Time Zone and Duration' style={{ marginBottom: 0 }}>
            <Tooltip title='Time Zone' placement='bottom'>
              <Form.Item
                name='timezone'
                style={{ display: 'inline-block', width: '70%' }}
              >
                <Select
                  showSearch={true}
                  placeholder='Select Time Zone'
                  defaultValue={task.timezone}
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
              rules={[{ pattern: /^[0-9]*$/, message: 'Invalid Duration' }]}
              style={{ display: 'inline-block', width: '30%' }}
            >
              <AutoComplete
                placeholder='Duration'
                options={options}
                defaultValue={task.duration ? task.duration.toString() : ''}
              >
                <Input suffix='Minutes' />
              </AutoComplete>
            </Form.Item>
          </Form.Item>

          {/* reminder */}
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>
            Reminder&nbsp;&nbsp;
          </span>
          <Radio.Group
            value={remindButton}
            onChange={(e) => {
              setRemindButton(e.target.value);
              setReminderType(e.target.value);
            }}
            buttonStyle='solid'
            style={{ marginBottom: 18 }}
          >
            <Radio value={'remindBefore'}>Time Before</Radio>
            <Radio value={'reminderDate'} disabled={dueType === 'dueByRec'}>
              Date (Time)
            </Radio>
          </Radio.Group>
          <div style={{ display: 'flex' }}>
            <Form.Item name='remindBefore'>
              <Select
                defaultValue={
                  task.reminderSetting && task.reminderSetting.before
                    ? ReminderBeforeTaskText[task.reminderSetting.before]
                    : ReminderBeforeTaskText[props.before]
                }
                disabled={reminderType !== 'remindBefore'}
                style={{ width: '180px' }}
                placeholder='Reminder Before Task'
              >
                {ReminderBeforeTaskText.map((before: string, index: number) => (
                  <Option key={index} value={index}>
                    {before}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div style={{ display: 'flex' }}>
              <Tooltip title='Reminder Date' placement='bottom'>
                <Form.Item name='reminderDate'>
                  <DatePicker
                    defaultValue={
                      task.reminderSetting && task.reminderSetting.date
                        ? moment(task.reminderSetting.date, 'YYYY-MM-DD')
                        : undefined
                    }
                    placeholder='Date'
                    disabled={reminderType !== 'reminderDate'}
                    allowClear={true}
                    onChange={(value) => {
                      if (value === null) {
                        setReminderTimeVisible(false);
                      } else {
                        setReminderTimeVisible(true);
                      }
                    }}
                  />
                </Form.Item>
              </Tooltip>
              {reminderTimeVisible && (
                <Tooltip title='Reminder Time' placement='bottom'>
                  <Form.Item name='reminderTime' style={{ width: '100px' }}>
                    <TimePicker
                      defaultValue={
                        task.reminderSetting.time
                          ? moment(task.reminderSetting.time, 'HH:mm')
                          : undefined
                      }
                      allowClear={true}
                      format='HH:mm'
                      placeholder='Time'
                      disabled={reminderType !== 'reminderDate'}
                    />
                  </Form.Item>
                </Tooltip>
              )}
            </div>
          </div>
        </Form>
      </Modal>
    );
  };

  if (props.mode === 'div') {
    return (
      <>
        <div onClick={openModal} className='popover-control-item'>
          <span>Edit</span>
          <EditTwoTone />
        </div>
        {getModal()}
      </>
    );
  }

  return (
    <>
      <Tooltip title={'Edit Task'}>
        <div>
          <EditTwoTone onClick={() => setVisible(!visible)} />
        </div>
      </Tooltip>
      {getModal()}
    </>
  );
};

const mapStateToProps = (state: IState) => ({
  startTime: state.rRule.startTime,
  startDate: state.rRule.startDate,
  timezone: state.settings.timezone,
  projectId: state.project.project.id,
  before: state.settings.before,
  group: state.group.group,
  myself: state.myself.username,
  start: state.rRule.start,
  repeat: state.rRule.repeat,
  end: state.rRule.end,
  rRuleString: state.rRule.rRuleString,
});

export default connect(mapStateToProps, {
  patchTask,
  updateExpandedMyself,
  convertToTextWithTime,
})(withRouter(EditTask));
