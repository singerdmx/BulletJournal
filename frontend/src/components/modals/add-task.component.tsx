import React, {useEffect, useState} from 'react';
import {AutoComplete, Avatar, Button, DatePicker, Form, Input, Modal, Radio, Select, TimePicker, Tooltip,} from 'antd';
import {useHistory, useParams} from 'react-router-dom';
import {CheckSquareTwoTone, CloseSquareTwoTone, PlusOutlined,} from '@ant-design/icons';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router';
import {createTask, updateTaskVisible} from '../../features/tasks/actions';
import {IState} from '../../store';
import './modals.styles.less';
import {zones} from '../settings/constants';
import {Group} from '../../features/group/interface';
import {updateExpandedMyself} from '../../features/myself/actions';
import ReactRRuleGenerator from '../../features/recurrence/RRuleGenerator';
import {ReminderBeforeTaskText} from '../settings/reducer';
import {convertToTextWithRRule,} from '../../features/recurrence/actions';
import {labelsUpdate} from '../../features/label/actions';
import {ReminderSetting} from '../../features/tasks/interface';
import {dateFormat} from '../../features/myBuJo/constants';
import {Project} from '../../features/project/interface';
import {Label} from '../../features/label/interface';
import {getIcon} from '../draggable-labels/draggable-label-list.component';
import {onFilterAssignees, onFilterLabel} from '../../utils/Util';
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {PlusCircleTwoTone} from "@ant-design/icons/lib";

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
  labelOptions: Label[];
  timezone: string;
  myself: string;
  before: number;
  start: any;
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
  const history = useHistory();
  const [dueType, setDueType] = useState('dueByTime');
  const [reminderType, setReminderType] = useState('remindBefore');
  const [reminderTimeVisible, setReminderTimeVisible] = useState(false);
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

    let duration = values.duration;
    if (duration && values.durationUnit && values.durationUnit === 'Hours') {
      duration *= 60;
    }
    if (props.project) {
      props.createTask(
        props.project.id,
        values.taskName,
        assignees,
        dueDate,
        dueTime,
        duration,
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

  const [rRuleText, setRRuleText] = useState(
    convertToTextWithRRule(props.rRuleString)
  );

  useEffect(() => {
    setRRuleText(convertToTextWithRRule(props.rRuleString));
  }, [props.rRuleString]);
  const getSelections = () => {
    if (!props.group || !props.group.users) {
      return null;
    }
    return (
      <Select
        mode="multiple"
        filterOption={(e, t) => onFilterAssignees(e, t)}
        defaultValue={props.myself}
        style={{ width: '100%' }}
      >
        {props.group.users
          .filter((u) => u.accepted)
          .map((user) => {
            return (
              <Option value={user.name} key={user.alias}>
                <Avatar size="small" src={user.avatar} />
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
        title="Create New Task"
        visible={props.addTaskVisible}
        okText="Create"
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
        <Form form={form} layout="vertical">
          {/* form for name */}
          <Form.Item
            name="taskName"
            label="Name"
            rules={[
              {
                required: true,
                message: 'Task Name must be between 1 and 50 characters',
                min: 1,
                max: 50,
              },
            ]}
          >
            <Input placeholder="Enter Task Name" allowClear />
          </Form.Item>
          {/* form for Assignees */}
          <Form.Item
            name="assignees"
            label={
              <span>
                Assignees{' '}
                <Tooltip title="Select All">
                  <CheckSquareTwoTone
                    onClick={selectAll}
                    style={{ cursor: 'pointer' }}
                  />
                </Tooltip>
                <Tooltip title="Clear All">
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
            buttonStyle="solid"
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
          {dueType === 'dueByTime' && (
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', flex: 1 }}>
                <Tooltip title="Select Due Date" placement="left">
                  <Form.Item name="dueDate" style={{ width: '100%' }}>
                    <DatePicker
                      allowClear={true}
                      style={{ width: '100%' }}
                      placeholder="Due Date"
                      disabled={dueType !== 'dueByTime'}
                    />
                  </Form.Item>
                </Tooltip>
                <Tooltip title="Select Due Time" placement="right">
                  <Form.Item name="dueTime" style={{width: '210px'}}>
                    <TimePicker
                        allowClear={true}
                        format="HH:mm"
                        placeholder="Due Time"
                        disabled={dueType !== 'dueByTime'}
                    />
                  </Form.Item>
                </Tooltip>
              </div>
            </div>
          )}
          {dueType === 'dueByRec' && (
            <div
              style={{
                borderTop: '1px solid #E8E8E8',
                borderBottom: '1px solid #E8E8E8',
                paddingTop: '24px',
                marginBottom: '24px',
              }}
            >
              <div className="recurrence-title">{rRuleText}</div>

              <ReactRRuleGenerator />
            </div>
          )}
          <Form.Item label="Time Zone and Duration" style={{ marginBottom: 0 }}>
            <Tooltip title="Time Zone" placement="bottom">
              <Form.Item
                name="timezone"
                style={{ display: 'inline-block', width: '50%' }}
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
              style={{ display: 'inline-block', width: '25%' }}
            >
              <AutoComplete placeholder="Duration" options={options}>
                <Input />
              </AutoComplete>
            </Form.Item>
            <Form.Item
                name="durationUnit"
                style={{ display: 'inline-block', width: '25%' }}
            >
              <Select defaultValue={'Minutes'}>
                <Option value="Minutes">Minute(s)</Option>
                <Option value="Hours">Hour(s)</Option>
              </Select>
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
            buttonStyle="solid"
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
            <Form.Item name="remindBefore">
              <Select
                defaultValue={ReminderBeforeTaskText[props.before]}
                disabled={reminderType !== 'remindBefore'}
                style={{ width: '180px' }}
                placeholder="Reminder Before Task"
              >
                {ReminderBeforeTaskText.map((before: string, index: number) => (
                  <Option key={index} value={index}>
                    {before}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <div style={{ display: 'flex' }}>
              <Tooltip title="Reminder Date" placement="bottom">
                <Form.Item name="reminderDate">
                  <DatePicker
                    placeholder="Date"
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
                <Tooltip title="Reminder Time" placement="bottom">
                  <Form.Item name="reminderTime" style={{ width: '100px' }}>
                    <TimePicker
                      allowClear={true}
                      format="HH:mm"
                      placeholder="Time"
                      disabled={reminderType !== 'reminderDate'}
                    />
                  </Form.Item>
                </Tooltip>
              )}
            </div>
          </div>

          {/* label */}
          <div>
            <Form.Item name="labels" label={
              <Tooltip title="Click to go to labels page to create label">
                <span style={{cursor: 'pointer'}} onClick={() => history.push('/labels')}>
                  Labels&nbsp;<PlusCircleTwoTone />
                </span>
              </Tooltip>
            }>
              <Select
                mode="multiple"
                filterOption={(e, t) => onFilterLabel(e, t)}
              >
                {props.labelOptions &&
                  props.labelOptions.length &&
                  props.labelOptions.map((l) => {
                    return (
                      <Option value={l.id} key={l.value}>
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
      <div className="add-task">
        <Button type="primary" onClick={openModal}>
          Create New Task
        </Button>
        {getModal()}
      </div>
    );
  }

  return (
      <>
        <FloatButton
            tooltip="Add New Task"
            onClick={openModal}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <PlusOutlined/>
        </FloatButton>
        {getModal()}
      </>
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
  end: state.rRule.end,
  rRuleString: state.rRule.rRuleString,
  addTaskVisible: state.task.addTaskVisible,
  labelOptions: state.label.labelOptions,
});

export default connect(mapStateToProps, {
  createTask,
  updateExpandedMyself,
  updateTaskVisible,
  labelsUpdate,
})(withRouter(AddTask));
