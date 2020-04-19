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

    const handleOpen = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        calendar && calendar.id && props.updateWatchedProject(calendar.id);
        // calendar && calendar.id && props.googleCalendarEventListUpdate(calendar.id, calendar.timeZone);
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

    const getProjectSelections = () => {
        if (projects && projects[0]) {
            return (
                <Form form={form} labelAlign='left'>
                    <Tooltip title='Choose BuJo' placement='topLeft'>
                        <Form.Item name='project'>
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
                        </Form.Item>
                    </Tooltip>
                </Form>
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
            <Form form={form} labelAlign='left'>
                {projectKeepInSync()}
                <Form.Item>
                    <RangePicker/>
                    <Button>Pull</Button>
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