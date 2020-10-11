import React, {useEffect, useState} from 'react';
import {AutoComplete, Avatar, DatePicker, Form, Input, Modal, Radio, Select, TimePicker, Tooltip,} from 'antd';
import {CheckSquareTwoTone, CloseSquareTwoTone, EditTwoTone,} from '@ant-design/icons';
import {connect} from 'react-redux';
import {RouteComponentProps, useParams, withRouter} from 'react-router';
import {patchTask} from '../../features/tasks/actions';
import {IState} from '../../store';
import './modals.styles.less';
import {zones} from '../settings/constants';
import {Group} from '../../features/group/interface';
import {updateExpandedMyself} from '../../features/myself/actions';
import ReactRRuleGenerator from '../../features/recurrence/RRuleGenerator';
import {ReminderBeforeTaskText} from '../settings/reducer';
import {labelsUpdate} from '../../features/label/actions';
import {convertToTextWithRRule, updateRruleString,} from '../../features/recurrence/actions';
import {ReminderSetting, Task} from '../../features/tasks/interface';
import {dateFormat} from '../../features/myBuJo/constants';
import moment from 'moment';
import {Project} from '../../features/project/interface';
import {Label} from '../../features/label/interface';
import {getIcon} from '../draggable-labels/draggable-label-list.component';
import {onFilterAssignees, onFilterLabel} from '../../utils/Util';
import {ProjectItemUIType} from "../../features/project/constants";
import {useHistory} from "react-router-dom";
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
  mode: string;
  type: ProjectItemUIType;
  task: Task;
  project: Project | undefined;
  group: Group | undefined;
};

interface TaskEditFormProps {
  patchTask: (
    taskId: number,
    timezone: string,
    type: ProjectItemUIType,
    name?: string,
    assignees?: string[],
    dueDate?: string,
    dueTime?: string,
    duration?: number,
    reminderSetting?: ReminderSetting,
    recurrenceRule?: string,
    labels?: number[]
  ) => void;
  updateRruleString: (task: Task) => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
  timezone: string;
  start: any;
  end: any;
  myself: any;
  before: number;
  startTime: string;
  startDate: string;
  rRuleString: any;
  labelOptions: Label[];
  labelsUpdate: (projectId: number | undefined) => void;
}

const EditTask: React.FC<
  RouteComponentProps & TaskProps & TaskEditFormProps
> = (props) => {
  const {
    task,
    type,
    patchTask,
    labelsUpdate,
    rRuleString,
    group,
    updateExpandedMyself,
    mode,
  } = props;

  const [form] = Form.useForm();
  const history = useHistory();
  const [visible, setVisible] = useState(false);
  const [dueType, setDueType] = useState(
    !!task.recurrenceRule && task.recurrenceRule.length > 0
      ? 'dueByRec'
      : 'dueByTime'
  );
  const [reminderType, setReminderType] = useState('remindBefore');
  const [reminderTimeVisible, setReminderTimeVisible] = useState(false);
  const [durationU, setDurationU] = useState(task && task.duration && task.duration % 60 === 0 ? 'Hours' : 'Minutes');
  const [remindButton, setRemindButton] = useState('remindBefore');
  const [rRuleText, setRRuleText] = useState(
    convertToTextWithRRule(props.rRuleString)
  );

  useEffect(() => {
    setRRuleText(convertToTextWithRRule(props.rRuleString));
  }, [props.rRuleString]);
  const { projectId } = useParams();

  useEffect(() => {
    if (projectId) {
      labelsUpdate(parseInt(projectId));
    }
  }, [projectId]);

  const updateTask = (values: any) => {
    // "undefined" means user didn't change it
    // "null" means user cleared it
    let dueDate;
    if (values.dueDate === null) {
      dueDate = null;
    } else if (values.dueDate === undefined) {
      dueDate = task.dueDate;
    } else {
      dueDate = values.dueDate.format(dateFormat);
    }

    let dueTime;
    if (values.dueTime === null) {
      dueTime = null;
    } else if (values.dueTime === undefined) {
      dueTime = task.dueTime;
    } else {
      dueTime = values.dueTime.format('HH:mm');
    }
    let recurrence = rRuleString;
    if (dueType === 'dueByRec') {
      dueDate = null;
      dueTime = null;
    } else {
      recurrence = null;
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
        values.remindBefore === undefined
          ? task.reminderSetting.before
          : values.remindBefore,
    } as ReminderSetting;
    if (reminderType === 'remindBefore') {
      reminderSetting.date = undefined;
      reminderSetting.time = undefined;
    } else {
      reminderSetting.before = undefined;
    }

    let duration = values.duration;
    if (duration === '') {
      // user clears duration
      duration = 0;
    } else if (duration) {
      // user changed duration
      if (durationU === 'Hours') {
        duration *= 60;
      }
    } else if (values.durationUnit && task.duration) {
      // user changed durationUnit but didn't change duration
      duration = task.duration;
      const oldDurationUnit = task.duration % 60 === 0 ? 'Hours' : 'Minutes';
      if (oldDurationUnit !== durationU) {
        if (durationU === 'Hours') {
          duration *= 60;
        } else {
          duration /= 60;
        }
      }
    }

    patchTask(
      task.id,
      timezone,
      type,
      values.taskName,
      assignees,
      dueDate,
      dueTime,
      duration,
      reminderSetting,
      recurrence,
      values.labels
    );
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setVisible(false);
    setDueType((dueType) =>
      !!task.recurrenceRule && task.recurrenceRule.length > 0
        ? 'dueByRec'
        : 'dueByTime'
    );
  };

  const openModal = () => {
    if (task) {
      task.recurrenceRule && props.updateRruleString(task);
    }
    setVisible(true);
  };

  const selectAll = () => {
    if (group) {
      form.setFields([
        {
          name: 'assignees',
          value: group.users.filter((u) => u.accepted).map((user) => user.name),
        },
      ]);
    }
  };

  const clearAll = () => {
    form.setFields([{ name: 'assignees', value: [] }]);
  };

  const handleDurationUnitChange = (e: string) => {
    setDurationU(e);
  }

  useEffect(() => {
    updateExpandedMyself(true);
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

  const getSelections = (task: Task) => {
    if (!group || !group.users) {
      return null;
    }
    return (
      <Select
        mode="multiple"
        filterOption={(e, t) => onFilterAssignees(e, t)}
        defaultValue={task.assignees ? task.assignees.map((u) => u.name) : []}
        style={{ width: '100%' }}
      >
        {group.users
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
        title="Edit Task"
        visible={visible}
        okText="Confirm"
        destroyOnClose
        onCancel={(e) => handleCancel(e)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              setVisible(!visible);
              updateTask(values);
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
                message: 'Task Name must be between 1 and 50 characters',
                min: 1,
                max: 50,
              },
            ]}
          >
            <Input
              allowClear
              placeholder="Enter Task Name"
              defaultValue={task.name ? task.name : ''}
            />
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
            {getSelections(task)}
          </Form.Item>
          {/* due type */}
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>Due&nbsp;&nbsp;</span>
          <Radio.Group
            defaultValue={dueType}
            value={dueType}
            onChange={(e) => {
              setDueType(e.target.value);
            }}
            buttonStyle="solid"
            style={{ marginBottom: 18 }}
          >
            <Radio value={'dueByTime'}>
              <span onClick={() => setDueType('dueByTime')}>Date (Time)</span>
            </Radio>
            <Radio
              value={'dueByRec'}
              onClick={() => {
                //force remind option to be before
                setRemindButton('remindBefore');
                setReminderType('remindBefore');
              }}
            >
              <span onClick={() => {
                setDueType('dueByRec');
                //force remind option to be before
                setRemindButton('remindBefore');
                setReminderType('remindBefore');
              }}>Recurrence</span>
            </Radio>
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
                      defaultValue={
                        //  defaultValue here not work try to set initail value on Form outside
                        task.dueDate
                          ? moment(task.dueDate, dateFormat)
                          : undefined
                      }
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
                        defaultValue={
                          //  defaultValue here not work try to set initail value on Form outside
                          task.dueTime
                              ? moment(task.dueTime, 'HH:mm')
                              : undefined
                        }
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
              <div className="recurrence-title">
                <div>{rRuleText}</div>
              </div>
              <ReactRRuleGenerator />
            </div>
          )}
          {/* timezone and duration */}
          <Form.Item label="Time Zone and Duration" style={{ marginBottom: 0 }}>
            <Tooltip title="Time Zone" placement="bottom">
              <Form.Item
                name="timezone"
                style={{ display: 'inline-block', width: '50%' }}
              >
                <Select
                  showSearch={true}
                  placeholder="Select Time Zone"
                  defaultValue={task.timezone}
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
              <AutoComplete
                placeholder="Duration"
                options={options}
                defaultValue={task.duration ? (task.duration % 60 === 0 ? task.duration / 60 : task.duration).toString() : ''}
              >
                <Input />
              </AutoComplete>
            </Form.Item>
            <Form.Item
                name="durationUnit"
                style={{ display: 'inline-block', width: '25%' }}
            >
              <Select onChange={handleDurationUnitChange}
                      defaultValue={task.duration && task.duration % 60 === 0 ? 'Hours' : 'Minutes'}>
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
            <Radio value={'remindBefore'}><span onClick={() => {
              setRemindButton('remindBefore');
              setReminderType('remindBefore');
            }}>Time Before</span></Radio>
            <Radio value={'reminderDate'} disabled={dueType === 'dueByRec'}>
              <span onClick={() => {
                setRemindButton('reminderDate');
                setReminderType('reminderDate');
              }}>Date (Time)</span>
            </Radio>
          </Radio.Group>
          <div style={{ display: 'flex' }}>
            <Form.Item name="remindBefore">
              <Select
                defaultValue={
                  task.reminderSetting && task.reminderSetting.before
                    ? ReminderBeforeTaskText[task.reminderSetting.before]
                    : ReminderBeforeTaskText[props.before]
                }
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
                    defaultValue={
                      task.reminderSetting && task.reminderSetting.date
                        ? moment(task.reminderSetting.date, 'YYYY-MM-DD')
                        : undefined
                    }
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
                      defaultValue={
                        task.reminderSetting.time
                          ? moment(task.reminderSetting.time, 'HH:mm')
                          : undefined
                      }
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
                defaultValue={task.labels.map((l) => {
                  return l.id;
                })}
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

  if (mode === 'div') {
    return (
      <>
        <div onClick={openModal} className="popover-control-item">
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
          <EditTwoTone onClick={openModal} />
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
  project: state.project.project,
  before: state.settings.before,
  group: state.group.group,
  myself: state.myself.username,
  start: state.rRule.start,
  end: state.rRule.end,
  rRuleString: state.rRule.rRuleString,
  labelOptions: state.label.labelOptions,
});

export default connect(mapStateToProps, {
  patchTask,
  updateExpandedMyself,
  labelsUpdate,
  updateRruleString,
})(withRouter(EditTask));
