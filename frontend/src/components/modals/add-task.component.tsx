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
  Button,
} from 'antd';
import { useParams } from 'react-router-dom';
import {
  PlusOutlined,
  CheckSquareTwoTone,
  CloseSquareTwoTone,
} from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { createTask, updateTaskVisible } from '../../features/tasks/actions';
import { IState } from '../../store';
import './modals.styles.less';
import { zones } from '../settings/constants';
import {Group, User} from '../../features/group/interface';
import { updateExpandedMyself } from '../../features/myself/actions';
import ReactRRuleGenerator from '../../features/recurrence/RRuleGenerator';
import { ReminderBeforeTaskText } from '../settings/reducer';
import { convertToTextWithTime } from '../../features/recurrence/actions';
import { labelsUpdate } from '../../features/label/actions';
import { ReminderSetting } from '../../features/tasks/interface';
import { dateFormat } from '../../features/myBuJo/constants';
import { Project } from '../../features/project/interface';
import { Label } from '../../features/label/interface';
import { getIcon } from '../draggable-labels/draggable-label-list.component';
import { onFilterAssignees, onFilterLabel } from "../../utils/Util";
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
  project: Project | undefined;
  group: Group | undefined;
};

interface TaskCreateFormProps {
  mode: string;
  createTask: (
    projectId: number,
    name: string,
    assignees: string[],
    dueDate: string,
    dueTime: string,
    duration: number,
    reminderSetting: ReminderSetting,
    recurrenceRule: string,
    timezone: string,
    labels: number[]
  ) => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
  convertToTextWithTime: (start: any, repeat: any, end: any) => string;
  labelOptions: Label[];
  timezone: string;
  myself: string;
  before: number;
  start: any;
  repeat: any;
  end: any;
  startTime: string;
  startDate: string;
  rRuleString: any;
  addTaskVisible: boolean;
  updateTaskVisible: (addTaskVisible: boolean) => void;
  labelsUpdate: (projectId: number | undefined) => void;
}

const AddTask: React.FC<
  RouteComponentProps & TaskProps & TaskCreateFormProps
> = (props) => {
  const [form] = Form.useForm();
  const [dueType, setDueType] = useState('dueByTime');
  const [reminderType, setReminderType] = useState('remindBefore');
  const [dueTimeVisible, setDueTimeVisible] = useState(false);
  const [reminderTimeVisible, setReminderTimeVisible] = useState(false);
  const [recurrenceVisible, setRecurrenceVisible] = useState(false);
  const [remindButton, setRemindButton] = useState('remindBefore');
  const { projectId } = useParams();

  useEffect(() => {
    if (projectId) {
      props.labelsUpdate(parseInt(projectId));
    }
  }, [projectId]);

  const addTask = (values: any) => {
    //convert time object to string
    let dueDate = values.dueDate
      ? values.dueDate.format(dateFormat)
      : undefined;
    let dueTime = values.dueTime ? values.dueTime.format('HH:mm') : undefined;
    let recurrence = dueType === 'dueByRec' ? props.rRuleString : undefined;
    if (dueType === 'dueByRec') {
      dueDate = undefined;
      dueTime = undefined;
    } else {
      recurrence = undefined;
    }

    const assignees = values.assignees ? values.assignees : [props.myself];
    const timezone = values.timezone ? values.timezone : props.timezone;

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

    if (props.project) {
      props.createTask(
        props.project.id,
        values.taskName,
        assignees,
        dueDate,
        dueTime,
        values.duration,
        reminderSetting,
        recurrence,
        timezone,
        values.labels
      );
    }
    props.updateTaskVisible(false);
  };
  const onCancel = () => props.updateTaskVisible(false);
  const openModal = () => {
    props.updateTaskVisible(true);
  };
  const selectAll = () => {
    if (props.group) {
      form.setFields([
        {
          name: 'assignees',
          value: props.group.users
            .filter((u) => u.accepted)
            .map((user) => user.name),
        },
      ]);
    }
  };
  const clearAll = () => {
    form.setFields([{ name: 'assignees', value: [] }]);
  };
  useEffect(() => {
    props.updateExpandedMyself(true);
  }, []);
  const result = ['15', '30', '45', '60'];
  const options = result.map((time: string) => {
    return { value: time };
  });

  let rRuleText = convertToTextWithTime(props.start, props.repeat, props.end);
  rRuleText =
    rRuleText === 'Every year'
      ? 'Recurrence'
      : (rRuleText +=
          ' starting at ' + props.startDate + ' ' + props.startTime);
  // split string by n words including marks like space , - : n is setting by {0, n} which is {0, 5} right now
  const rRuleTextList = rRuleText.match(
    /\b[\w,|\w-|\w:]+(?:\s+[\w,|\w-|\w:]+){0,5}/g
  );

  const getSelections = () => {
    if (!props.group || !props.group.users) {
      return null;
    }
    return (
      <Select
        mode='multiple'
        filterOption={(e, t) => onFilterAssignees(e, t)}
        defaultValue={props.myself}
        style={{ width: '100%' }}
      >
        {props.group.users
          .filter((u) => u.accepted)
          .map((user) => {
            return (
              <Option value={user.name} key={user.alias}>
                <Avatar size='small' src={user.avatar} />
                &nbsp;&nbsp; <strong>{user.alias}</strong>
              </Option>
            );
          })}
      </Select>
    );
  };

  const getModal = () => {
    return (
      <Modal
        title='Create New Task'
        visible={props.addTaskVisible}
        okText='Create'
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values);
              form.resetFields();
              addTask(values);
            })
            .catch((info) => console.log(info));
        }}
      >
        <Form form={form} layout='vertical'>
          {/* form for name */}
          <Form.Item
            name='taskName'
            label='Name'
            rules={[{ required: true, message: 'Task Name must be between 1 and 50 characters', min: 1, max: 50 }]}
          >
            <Input placeholder='Enter Task Name' allowClear />
          </Form.Item>
          {/* form for Assignees */}
          <Form.Item
            name='assignees'
            label={
              <span>
                Assignees{' '}
                <Tooltip title='Select All'>
                  <CheckSquareTwoTone
                    onClick={selectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </Tooltip>
                <Tooltip title='Clear All'>
                  <CloseSquareTwoTone
                    onClick={clearAll}
                    style={{ cursor: 'pointer' }}
                  />
                </Tooltip>
              </span>
            }
          >
            {getSelections()}
          </Form.Item>
          {/* due type */}
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>Due&nbsp;&nbsp;</span>
          <Radio.Group
            defaultValue={'dueByTime'}
            onChange={(e) => setDueType(e.target.value)}
            buttonStyle='solid'
            style={{ marginBottom: 18 }}
          >
            <Radio.Button value={'dueByTime'}>Date (Time)</Radio.Button>
            <Radio.Button
              value={'dueByRec'}
              onClick={() => {
                //force remind option to be before
                setRemindButton('remindBefore');
                setReminderType('remindBefore');
              }}
            >
              Recurrence
            </Radio.Button>
          </Radio.Group>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex', flex: 1 }}>
              <Tooltip title='Select Due Date' placement='left'>
                <Form.Item name='dueDate' style={{ width: '100%' }}>
                  <DatePicker
                    allowClear={true}
                    style={{ width: '100%' }}
                    placeholder='Due Date'
                    disabled={dueType !== 'dueByTime'}
                    onChange={(value) => setDueTimeVisible(value !== null)}
                  />
                </Form.Item>
              </Tooltip>
              {dueTimeVisible && (
                <Tooltip title='Select Due Time' placement='right'>
                  <Form.Item name='dueTime' style={{ width: '210px' }}>
                    <TimePicker
                      allowClear={true}
                      format='HH:mm'
                      placeholder='Due Time'
                      disabled={dueType !== 'dueByTime'}
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
                  <Button type='default' disabled={dueType !== 'dueByRec'}>
                    <p className='marquee'>{rRuleText}</p>
                  </Button>
                </Popover>
              </Tooltip>
            </Form.Item>
          </div>
          <Form.Item label='Time Zone and Duration' style={{ marginBottom: 0 }}>
            <Tooltip title='Time Zone' placement='bottom'>
              <Form.Item
                name='timezone'
                style={{ display: 'inline-block', width: '70%' }}
              >
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
              rules={[{ pattern: /^[0-9]*$/, message: 'Invalid Duration' }]}
              style={{ display: 'inline-block', width: '30%' }}
            >
              <AutoComplete placeholder='Duration' options={options}>
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
            <Radio.Button value={'remindBefore'}>Time Before</Radio.Button>
            <Radio.Button
              value={'reminderDate'}
              disabled={dueType === 'dueByRec'}
            >
              Date (Time)
            </Radio.Button>
          </Radio.Group>
          <div style={{ display: 'flex' }}>
            <Form.Item name='remindBefore'>
              <Select
                defaultValue={ReminderBeforeTaskText[props.before]}
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

          {/* label */}
          <div>
            <Form.Item name='labels' label='Labels'>
              <Select
                  mode='multiple'
                  filterOption={(e, t) => onFilterLabel(e, t)}>
                {props.labelOptions &&
                  props.labelOptions.length &&
                  props.labelOptions.map((l) => {
                    return (
                      <Option value={l.value} key={l.id}>
                        {getIcon(l.icon)} &nbsp;{l.value}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  };

  if (props.mode === 'button') {
    return (
      <div className='add-task'>
        <Button type='primary' onClick={openModal}>
          Create New Task
        </Button>
        {getModal()}
      </div>
    );
  }

  return (
    <Tooltip placement='top' title='Create New Task'>
      <div className='add-task'>
        <PlusOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={openModal}
          title='Create New Task'
        />
        {getModal()}
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state: IState) => ({
  startTime: state.rRule.startTime,
  startDate: state.rRule.startDate,
  project: state.project.project,
  timezone: state.settings.timezone,
  group: state.group.group,
  myself: state.myself.username,
  before: state.settings.before,
  start: state.rRule.start,
  repeat: state.rRule.repeat,
  end: state.rRule.end,
  rRuleString: state.rRule.rRuleString,
  addTaskVisible: state.task.addTaskVisible,
  labelOptions: state.label.labelOptions,
});

export default connect(mapStateToProps, {
  createTask,
  updateExpandedMyself,
  convertToTextWithTime,
  updateTaskVisible,
  labelsUpdate,
})(withRouter(AddTask));
