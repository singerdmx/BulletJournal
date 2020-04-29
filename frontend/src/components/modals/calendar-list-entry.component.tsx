import React, { useState } from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Project } from '../../features/project/interface';
import {
  Avatar,
  Button,
  Card,
  DatePicker,
  Form,
  Modal,
  Select,
  Tooltip,
} from 'antd';
import { iconMapper } from '../side-menu/side-menu.component';
import AddProject from './add-project.component';
import { useHistory } from 'react-router-dom';
import {
  CalendarListEntry,
  GoogleCalendarEvent,
} from '../../features/calendarSync/interface';
import {
  googleCalendarEventListReceived,
  googleCalendarEventListUpdate,
  unwatchCalendar,
  updateWatchedProject,
  watchCalendar,
} from '../../features/calendarSync/actions';

import './modals.styles.less';
import moment from 'moment';
import { dateFormat } from '../../features/myBuJo/constants';
import { Task, getReminderSettingString } from '../../features/tasks/interface';
import { getDueDateTime } from '../project-item/task-item.component';
import {
  AlertOutlined,
  CheckSquareTwoTone,
  CloseSquareTwoTone,
} from '@ant-design/icons';
const { RangePicker } = DatePicker;
const { Option } = Select;

type ModalProps = {
  projects: Project[];
  calendar: CalendarListEntry;
  watchedProject: Project | undefined;
  eventList: GoogleCalendarEvent[];
  updateWatchedProject: (calendarId: string) => void;
  watchCalendar: (calendarId: string, projectId: number) => void;
  unwatchCalendar: (calendarId: string) => void;
  googleCalendarEventListUpdate: (
    calendarId: string,
    timezone: string,
    startDate?: string,
    endDate?: string
  ) => void;
  googleCalendarEventListReceived: (
    googleCalendarEventList: GoogleCalendarEvent[]
  ) => void;
};

const CalendarListEntryModal: React.FC<ModalProps> = (props) => {
  const {
    calendar,
    watchedProject,
    projects,
    eventList,
    googleCalendarEventListReceived,
  } = props;
  const [visible, setVisible] = useState(false);
  const history = useHistory();
  const [form] = Form.useForm();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleOpen = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    calendar && calendar.id && props.updateWatchedProject(calendar.id);
    setVisible(true);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    googleCalendarEventListReceived([] as GoogleCalendarEvent[]);
    form.setFields([
      {
        name: 'eventList',
        value: [] as GoogleCalendarEvent[],
      },
    ]);
    setVisible(false);
  };

  const handleWatchCalendar = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();
    // TODO: check projects.length
    props.watchCalendar(calendar.id, projects[0].id);
  };

  const handleUnwatchCalendar = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();
    props.unwatchCalendar(calendar.id);
  };

  const handlePullEvents = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    form
      .validateFields()
      .then((values) => {
        const startDate = values.startEndDates
          ? values.startEndDates[0].format('YYYY-MM-DD')
          : null;
        const endDate = values.startEndDates
          ? values.startEndDates[1].format('YYYY-MM-DD')
          : null;
        console.log(values);
        props.googleCalendarEventListUpdate(
          calendar.id,
          calendar.timeZone,
          startDate,
          endDate
        );
      })
      .catch((info) => console.log(info));
  };

  const getProjectSelections = () => {
    if (projects && projects[0]) {
      return (
        <Tooltip title='Choose BuJo' placement='topLeft'>
          <Select
            placeholder='Choose BuJo'
            style={{ width: '100%' }}
            defaultValue={projects[0].id}
          >
            {projects.map((project) => {
              return (
                <Option value={project.id} key={project.id}>
                  <Tooltip title={project.owner} placement='right'>
                    <span>
                      <Avatar size='small' src={project.ownerAvatar} />
                      &nbsp; {iconMapper[project.projectType]}
                      &nbsp; <strong>{project.name}</strong>
                      &nbsp; (Group <strong>{project.group.name}</strong>)
                    </span>
                  </Tooltip>
                </Option>
              );
            })}
          </Select>
        </Tooltip>
      );
    }

    return <AddProject history={history} mode={'singular'} />;
  };

  const projectKeepInSync = () => {
    return (
      <div>
        <div>{watchedProject ? watchedProject!.name : 'not synced'}</div>
        <div>
          <Button onClick={(e) => handleWatchCalendar(e)}>Keep in sync</Button>
        </div>
        <div>
          <Button onClick={(e) => handleUnwatchCalendar(e)}>
            Stop syncing
          </Button>
        </div>
      </div>
    );
  };

  const selectAll = () => {
    form.setFields([
      {
        name: 'eventList',
        value: props.eventList.map((event) => event.iCalUID),
      },
    ]);
  };
  const clearAll = () => {
    form.setFields([
      {
        name: 'eventList',
        value: [],
      },
    ]);
  };

  return (
    <Card
      key={calendar.id}
      onClick={(e) => handleOpen(e)}
      className='card-style'
      style={{
        backgroundColor: calendar.backgroundColor,
        color: calendar.foregroundColor,
      }}
    >
      <span>{calendar.summary}</span>
      <Modal
        destroyOnClose
        centered
        title={`Sync Calendar "${calendar.summary}"`}
        visible={visible}
        okText='Confirm'
        onCancel={(e) => handleCancel(e)}
        footer={false}
      >
        <Form form={form} labelAlign='left'>
          {projectKeepInSync()}
          <div style={{ display: 'flex' }}>
            <Form.Item name='startEndDates'>
              <RangePicker
                ranges={{
                  Today: [moment(), moment()],
                  'This Week': [
                    moment().startOf('week'),
                    moment().endOf('week'),
                  ],
                  'This Month': [
                    moment().startOf('month'),
                    moment().endOf('month'),
                  ],
                }}
                size='small'
                allowClear={true}
                format={dateFormat}
                placeholder={['Start Date', 'End Date']}
              />
            </Form.Item>
            <Button onClick={(e) => handlePullEvents(e)}>Pull</Button>
          </div>
          <Form.Item
            name='eventList'
            label={
              <span>
                Event
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
            <Select mode='multiple' style={{ width: '100%' }}>
              {eventList &&
                eventList.map((event, index) => {
                  return (
                    <Option value={event.iCalUID}>
                      <div>
                        <div className='name-container'>
                          <div className='reminder'>
                            <Tooltip
                              title={getReminderSettingString(
                                event.task.reminderSetting
                              )}
                            >
                              <AlertOutlined />
                            </Tooltip>
                          </div>
                          <div className='name'>
                            <Tooltip
                              title={event.content && event.content.text}
                            >
                              <div>{event.task.name}</div>
                            </Tooltip>
                          </div>
                        </div>
                        <div className='time-container'>
                          <div className='due-time'>
                            {getDueDateTime(event.task)}
                          </div>
                        </div>
                      </div>
                    </Option>
                  );
                })}
            </Select>
          </Form.Item>
          <Form.Item
            name='eventList'
            label='Target BuJo'
            labelCol={{ span: 5 }}
            wrapperCol={{ span: 19 }}
          >
            {getProjectSelections()}
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

const mapStateToProps = (state: IState) => ({
  watchedProject: state.calendarSync.watchedProject,
  eventList: state.calendarSync.googleCalendarEventList,
});

export default connect(mapStateToProps, {
  updateWatchedProject,
  googleCalendarEventListUpdate,
  watchCalendar,
  unwatchCalendar,
  googleCalendarEventListReceived,
})(CalendarListEntryModal);
