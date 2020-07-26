import React, { useEffect, useState } from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Project } from '../../features/project/interface';
import {
  Avatar,
  Badge,
  Button,
  Card,
  DatePicker,
  Form,
  Modal,
  Select,
  Tabs,
  Tooltip,
} from 'antd';
import { iconMapper } from '../side-menu/side-menu.component';
import AddProject from './add-project.component';
import { useHistory } from 'react-router-dom';
import {
  CalendarListEntry,
  CalendarWatchedProject,
  GoogleCalendarEvent,
} from '../../features/calendarSync/interface';
import {
  googleCalendarEventListReceived,
  googleCalendarEventListUpdate,
  importEventsToProject,
  unwatchCalendar,
  updateWatchedProject,
  watchCalendar,
} from '../../features/calendarSync/actions';

import './modals.styles.less';
import moment from 'moment';
import { dateFormat } from '../../features/myBuJo/constants';
import { getReminderSettingString } from '../../features/tasks/interface';
import { getDueDateTime } from '../project-item/task-item.component';
import {
  AlertOutlined,
  CheckSquareTwoTone,
  CloseSquareTwoTone,
  CloudDownloadOutlined,
  DownCircleFilled,
  RetweetOutlined,
  SyncOutlined,
} from '@ant-design/icons';

const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Option } = Select;
const { Meta } = Card;

type ModalProps = {
  projects: Project[];
  calendar: CalendarListEntry;
  watchedProject: Project | undefined;
  watchedProjects: CalendarWatchedProject[];
  eventList: GoogleCalendarEvent[];
  syncing: boolean;
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
  importEventsToProject: (eventList: string[], projectId: number) => void;
};

const CalendarListEntryModal: React.FC<ModalProps> = (props) => {
  const {
    calendar,
    watchedProject,
    watchedProjects,
    projects,
    eventList,
    googleCalendarEventListReceived,
    importEventsToProject,
    syncing,
  } = props;
  const [visible, setVisible] = useState(false);
  const [isSync, setIsSync] = useState(false);
  const [syncedBuJo, setSyncedBuJo] = useState(
    undefined as Project | undefined
  );
  const history = useHistory();
  const [form] = Form.useForm();
  const [projectId, setProjectId] = useState(-1);
  const [importProjectId, setImportProjectId] = useState(-1);
  const [events, setEvents] = useState([] as string[]);

  useEffect(() => {
    if (projects && projects[0]) setProjectId(projects[0].id);
    else setProjectId(-1);
  }, [projects]);

  useEffect(() => {
    if (projects && projects[0]) setImportProjectId(projects[0].id);
    else setImportProjectId(-1);
  }, [projects]);

  useEffect(() => {
    if (watchedProject) setProjectId(watchedProject.id);
  }, [watchedProject]);

  useEffect(() => {
    let events: string[] = [];
    eventList.forEach((event) => {
      events.push(event.eventId);
    });
    setEvents(events);
  }, [eventList]);

  useEffect(() => {
    if (watchedProject) setIsSync(true);
    else setIsSync(false);
  }, [watchedProject]);

  useEffect(() => {
    watchedProjects.forEach(
      (calendarWatchedProject: CalendarWatchedProject) => {
        if (calendar.id === calendarWatchedProject.calendarId)
          setSyncedBuJo(calendarWatchedProject.project);
      }
    );
  }, [watchedProjects]);

  const handleOpen = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    calendar && calendar.id && props.updateWatchedProject(calendar.id);
    setVisible(true);
  };

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    googleCalendarEventListReceived([] as GoogleCalendarEvent[]);
    setVisible(false);
  };

  const handleWatchCalendar = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();
    if (projectId >= 0) props.watchCalendar(calendar.id, projectId);
  };

  const handleUnwatchCalendar = (
    e: React.MouseEvent<HTMLElement, MouseEvent>
  ) => {
    e.stopPropagation();
    props.unwatchCalendar(calendar.id);
    setSyncedBuJo(undefined);
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
        <Tooltip title="Choose BuJo" placement="topLeft">
          <Select
            style={{ width: '85%' }}
            placeholder="Choose BuJo"
            value={projectId}
            onChange={(value: any) => {
              setProjectId(value);
            }}
            disabled={isSync}
          >
            {projects.map((project) => {
              return (
                <Option value={project.id} key={project.id}>
                  <Tooltip
                    title={`${project.name} (Group ${project.group.name})`}
                    placement="right"
                  >
                    <span>
                      <Avatar size="small" src={project.owner.avatar} />
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
        <Tooltip
          title={isSync ? 'Stop syncing' : 'Keep in sync'}
          placement="bottom"
        >
          {isSync ? (
            <SyncOutlined
              style={{ fontSize: '22px', color: '#2593FC' }}
              spin
              onClick={(e) => {
                handleUnwatchCalendar(e);
              }}
            />
          ) : (
            <SyncOutlined
              style={{ fontSize: '22px', color: '#2593FC' }}
              onClick={(e) => {
                handleWatchCalendar(e);
              }}
            />
          )}
        </Tooltip>
      </div>
    );
  };

  const selectAll = () => {
    let events: string[] = [];
    props.eventList.forEach((event) => {
      events.push(event.eventId);
    });
    setEvents(events);
  };

  const clearAll = () => {
    setEvents([]);
  };

  const importTask = (eventList: string[], projectId: number) => {
    importEventsToProject(eventList, projectId);
    googleCalendarEventListReceived([] as GoogleCalendarEvent[]);
    setVisible(false);
    history.push(`/projects/${projectId}`);
  };

  const handleOnclick = (e: any) => {
    history.push(`/projects/${watchedProject?.id}`);
  };

  const getSyncCalendarTabPane = () => {
    if (calendar.accessRole.toLowerCase() === 'reader') {
      return null;
    }
    return (
      <TabPane
        key="sync"
        tab={
          <Tooltip title="Sync Calendar with BuJo" placement="left">
            <RetweetOutlined className="large-icon" />
          </Tooltip>
        }
      >
        <div className="sync-tab">
          <div className="sync-tab-title">
            {watchedProject ? (
              <div>
                <b>
                  Synced with
                  <span
                    onClick={handleOnclick}
                    style={{ cursor: 'pointer', color: '#2593FC' }}
                  >
                    &nbsp;&nbsp;
                    {iconMapper[watchedProject.projectType]}
                    &nbsp; <strong>{watchedProject!.name}</strong>
                    &nbsp; (Group <strong>{watchedProject!.group.name}</strong>)
                  </span>
                </b>
              </div>
            ) : (
              <div>
                <b>{syncing ? 'Syncing...' : 'Choose a BuJo to sync'}</b>
              </div>
            )}
          </div>
          <div className="sync-tab-selections">
            {getProjectSelections()}
            <div className="sync-tab-confirm">{projectKeepInSync()}</div>
          </div>
        </div>
      </TabPane>
    );
  };

  return (
    <div>
      <Badge dot color={calendar.backgroundColor} offset={[4, 6]}>
        <a href="#" className="head-example" />
      </Badge>

      <Card
        key={calendar.id}
        onClick={(e) => handleOpen(e)}
        hoverable
        className="card-style"
        style={{
          borderRadius: '15px',
        }}
      >
        <Meta
          title={calendar.summary}
          description={
            syncedBuJo
              ? `Synced with BuJo ${syncedBuJo!.name}`
              : 'Choose a BuJo to import calendar events'
          }
        />
        <Modal
          footer={false}
          destroyOnClose
          centered
          title={`Sync Calendar "${calendar.summary}"`}
          visible={visible}
          onCancel={(e) => handleCancel(e)}
        >
          <div>
            <Tabs
              defaultActiveKey={syncedBuJo ? 'sync' : 'pull'}
              tabPosition={'left'}
              type="card"
            >
              {getSyncCalendarTabPane()}
              <TabPane
                key="pull"
                tab={
                  <Tooltip title="Import Events from Calendar" placement="left">
                    <CloudDownloadOutlined className="large-icon" />
                  </Tooltip>
                }
              >
                <Form form={form} labelAlign="left">
                  <div className="pull-tab">
                    <div className="pull-tab-title">
                      <div>
                        <b>Choose a BuJo to import</b>
                      </div>
                    </div>
                    <div className="pull-tab-selections">
                      {projects && projects[0] && (
                        <Tooltip title="Choose BuJo" placement="topLeft">
                          <Select
                            style={{ width: '65%' }}
                            placeholder="Choose BuJo"
                            value={importProjectId}
                            onChange={(value: any) => {
                              setImportProjectId(value);
                            }}
                          >
                            {projects.map((project) => {
                              return (
                                <Option value={project.id} key={project.id}>
                                  <Tooltip
                                    title={`${project.name} (Group ${project.group.name})`}
                                    placement="right"
                                  >
                                    <span>
                                      <Avatar
                                        size="small"
                                        src={project.owner.avatar}
                                      />
                                      &nbsp; {iconMapper[project.projectType]}
                                      &nbsp; <strong>{project.name}</strong>
                                      &nbsp; (Group{' '}
                                      <strong>{project.group.name}</strong>)
                                    </span>
                                  </Tooltip>
                                </Option>
                              );
                            })}
                          </Select>
                        </Tooltip>
                      )}
                      <div className="pull-tab-selections-confirm">
                        {events.length > 0 ? (
                          <Button
                            type="primary"
                            onClick={() => {
                              form
                                .validateFields()
                                .then((values) => {
                                  console.log(values);
                                  importTask(events, importProjectId);
                                })
                                .catch((info) => console.log(info));
                            }}
                          >
                            Import
                          </Button>
                        ) : null}
                      </div>
                    </div>
                    <div className="pull-tab-date">
                      <Form.Item name="startEndDates">
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
                          size="small"
                          allowClear={true}
                          format={dateFormat}
                          placeholder={['Start Date', 'End Date']}
                        />
                      </Form.Item>
                      <div className="pull-tab-date-button">
                        <Tooltip title="Pull">
                          <DownCircleFilled
                            onClick={(e) => handlePullEvents(e)}
                          />
                        </Tooltip>
                      </div>
                    </div>
                    <div className="pull-tab-eventList">
                      <span>
                        Event&nbsp;&nbsp;
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
                      <Select
                        mode="multiple"
                        style={{ width: '100%' }}
                        value={events}
                        onChange={(e: any) => {
                          setEvents(e);
                        }}
                      >
                        {eventList &&
                          eventList.map((event, index) => {
                            return (
                              <Option value={event.eventId} key={event.eventId}>
                                <div>
                                  <div className="name-container">
                                    <div className="reminder">
                                      <Tooltip
                                        title={getReminderSettingString(
                                          event.task.reminderSetting
                                        )}
                                      >
                                        <AlertOutlined />
                                      </Tooltip>
                                    </div>
                                    <div className="name">
                                      <Tooltip
                                        title={
                                          event.content && event.content.text
                                        }
                                      >
                                        <div>{event.task.name}</div>
                                      </Tooltip>
                                    </div>
                                  </div>
                                  <div className="time-container">
                                    <div className="due-time">
                                      {getDueDateTime(event.task)}
                                    </div>
                                  </div>
                                </div>
                              </Option>
                            );
                          })}
                      </Select>
                    </div>
                  </div>
                </Form>
              </TabPane>
            </Tabs>
          </div>
        </Modal>
      </Card>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  watchedProject: state.calendarSync.watchedProject,
  watchedProjects: state.calendarSync.watchedProjects,
  eventList: state.calendarSync.googleCalendarEventList,
  syncing: state.calendarSync.syncing,
});

export default connect(mapStateToProps, {
  updateWatchedProject,
  googleCalendarEventListUpdate,
  watchCalendar,
  unwatchCalendar,
  googleCalendarEventListReceived,
  importEventsToProject,
})(CalendarListEntryModal);
