import React, {useEffect, useState} from "react";
import {IState} from "../../store";
import {connect} from 'react-redux';
import {Project, ProjectsWithOwner} from "../../features/project/interface";
import {flattenOwnedProject, flattenSharedProject} from "../../pages/projects/projects.pages";
import {ProjectType} from "../../features/project/constants";
import {Avatar, Button, Form, Modal, Select, Tooltip} from "antd";
import {iconMapper} from "../side-menu/side-menu.component";
import AddProject from "./add-project.component";
import {useHistory} from "react-router-dom";
import {CalendarListEntry, GoogleCalendarEvent} from "../../features/calendarSync/interface";
import {googleCalendarEventListUpdate, updateWatchedProject} from "../../features/calendarSync/actions";

const {Option} = Select;

type ModalProps = {
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
    calendar: CalendarListEntry;
    watchedProject: Project | undefined;
    eventList: GoogleCalendarEvent[];
    updateWatchedProject: (calendarId: string) => void;
    googleCalendarEventListUpdate: (calendarId: string, timezone: string, startDate?: string, endDate?: string) => void;
}

const CalendarListEntryModal: React.FC<ModalProps> = props => {
    const {calendar} = props;
    const [visible, setVisible] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const history = useHistory();
    const [form] = Form.useForm();

    useEffect(() => {
        setProjects([]);
        setProjects(flattenOwnedProject(props.ownedProjects, projects));
        setProjects(flattenSharedProject(props.sharedProjects, projects));
        setProjects(
            projects.filter(p => {
                return (
                    p.projectType === ProjectType.TODO && !p.shared
                );
            })
        );
    }, [props.ownedProjects, props.sharedProjects]);

    useEffect(() => {
        calendar && calendar.id && props.updateWatchedProject(calendar.id);
        calendar && calendar.id && props.googleCalendarEventListUpdate(calendar.id, calendar.timeZone);
    }, [props.calendar]);

    const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        setVisible(false);
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
            <div>{props.watchedProject}</div>
            <div>
                <Button>
                </Button>
            </div>
        </div>
    };

    return <div onClick={() => setVisible(true)}>
        <span>{calendar.summary}</span>
        <Modal
            destroyOnClose
            centered
            title={`Sync Calendar ${calendar.summary}`}
            visible={visible}
            okText='Confirm'
            onCancel={(e) => handleCancel(e)}
            footer={false}
        >
            <Form form={form} labelAlign='left'>
                {projectKeepInSync()}
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
    </div>
};

const mapStateToProps = (state: IState) => ({
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared,
    watchedProject: state.calendarSync.watchedProject,
    eventList: state.calendarSync.googleCalendarEventList
});

export default connect(mapStateToProps, {updateWatchedProject, googleCalendarEventListUpdate})(CalendarListEntryModal);