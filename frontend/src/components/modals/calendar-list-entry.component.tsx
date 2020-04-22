import React, {useState} from "react";
import {IState} from "../../store";
import {connect} from 'react-redux';
import {Project} from "../../features/project/interface";
import {Avatar, Button, Card, DatePicker, Form, Modal, Select, Tooltip} from "antd";
import {iconMapper} from "../side-menu/side-menu.component";
import AddProject from "./add-project.component";
import {useHistory} from "react-router-dom";
import {CalendarListEntry, GoogleCalendarEvent} from "../../features/calendarSync/interface";
import {
    googleCalendarEventListUpdate,
    unwatchCalendar,
    updateWatchedProject,
    watchCalendar
} from "../../features/calendarSync/actions";

import './modals.styles.less';
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";

const {RangePicker} = DatePicker;
const {Option} = Select;

type ModalProps = {
    projects: Project[];
    calendar: CalendarListEntry;
    watchedProject: Project | undefined;
    eventList: GoogleCalendarEvent[];
    updateWatchedProject: (calendarId: string) => void;
    watchCalendar: (calendarId: string, projectId: number) => void;
    unwatchCalendar: (calendarId: string) => void;
    googleCalendarEventListUpdate: (calendarId: string, timezone: string, startDate?: string, endDate?: string) => void;
}

const CalendarListEntryModal: React.FC<ModalProps> = props => {
    const {calendar, watchedProject, projects} = props;
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
        setVisible(false);
    };

    const handleWatchCalendar = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        props.watchCalendar(calendar.id, projects[0].id);
    };

    const handleUnwatchCalendar = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        props.unwatchCalendar(calendar.id);
    };

    const handlePullEvents = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        form.validateFields().then(values => {
            console.log(values);
            props.googleCalendarEventListUpdate(
                calendar.id, calendar.timeZone, "2019-01-01", "2020-08-08");
        }).catch((info) => console.log(info));
    };

    const getProjectSelections = () => {
        if (projects && projects[0]) {
            return (
                <Tooltip title='Choose BuJo' placement='topLeft'>
                    <Select
                        placeholder='Choose BuJo'
                        style={{width: '100%'}}
                        defaultValue={projects[0].id}
                    >
                        {projects.map(project => {
                            return (
                                <Option value={project.id} key={project.id}>
                                    <Tooltip title={project.owner} placement='right'>
                        <span>
                          <Avatar size='small' src={project.ownerAvatar}/>
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

        return <AddProject history={history} mode={'singular'}/>;
    };

    const projectKeepInSync = () => {
        return <div>
            <div>{watchedProject ? watchedProject!.name : 'not synced'}</div>
            <div>
                <Button onClick={(e) => handleWatchCalendar(e)}>
                    Keep in sync
                </Button>
            </div>
            <div>
                <Button onClick={(e) => handleUnwatchCalendar(e)}>
                    Stop syncing
                </Button>
            </div>
        </div>
    };

    return <Card
        key={calendar.id}
        onClick={(e) => handleOpen(e)}
        className='card-style'
        style={{backgroundColor: calendar.backgroundColor, color: calendar.foregroundColor}}>
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
            <Form form={form}
                  labelAlign='left'>
                {projectKeepInSync()}
                <Form.Item name='startEndDates'>
                    <RangePicker
                        ranges={{
                            Today: [moment(), moment()],
                            'This Week': [moment().startOf('week'), moment().endOf('week')],
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
                    <Button onClick={(e) => handlePullEvents(e)}>Pull</Button>
                </Form.Item>
                <Form.Item
                    name='project'
                    label='Target BuJo'
                    labelCol={{span: 5}}
                    wrapperCol={{span: 19}}
                >
                    {getProjectSelections()}
                </Form.Item>
            </Form>
        </Modal>
    </Card>
};

const mapStateToProps = (state: IState) => ({
    watchedProject: state.calendarSync.watchedProject,
    eventList: state.calendarSync.googleCalendarEventList
});

export default connect(mapStateToProps, {
    updateWatchedProject,
    googleCalendarEventListUpdate,
    watchCalendar,
    unwatchCalendar
})(CalendarListEntryModal);