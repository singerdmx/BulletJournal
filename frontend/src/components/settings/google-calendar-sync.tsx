import React, {useEffect, useState} from 'react';
import {useHistory} from 'react-router-dom';
import {Avatar, Button, Card, Form, Select, Tabs, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {loginGoogleCalendar, logoutGoogleCalendar} from '../../apis/calendarApis';
import {googleTokenExpirationTimeUpdate} from "../../features/calendarSync/actions";
import {ApiOutlined, SwapOutlined} from '@ant-design/icons';
import './calendar-sync.styles.less';
import {IState} from "../../store";
import {Project, ProjectsWithOwner} from "../../features/project/interface";
import {flattenOwnedProject, flattenSharedProject} from "../../pages/projects/projects.pages";
import {ProjectType} from "../../features/project/constants";
import {iconMapper} from "../side-menu/side-menu.component";
import AddProject from "../modals/add-project.component";
import {CalendarListEntry} from "../../features/calendarSync/interface";

const {Option} = Select;
const {TabPane} = Tabs;

const handleGoogleCalendarLogin = () => {
    loginGoogleCalendar().then(res => {
        window.location.href = res.headers.get('Location')!;
    });
};

const handleGoogleCalendarLogout = () => {
    logoutGoogleCalendar().then(res => {
        window.location.reload();
    });
};

type SettingProps = {
    googleTokenExpirationTime: number;
    calendarList: CalendarListEntry[];
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
    googleTokenExpirationTimeUpdate: () => void;
};

const GoogleCalendarSyncPage: React.FC<SettingProps> = (props) => {
    const {googleTokenExpirationTime, calendarList} = props;
    const history = useHistory();
    const [form] = Form.useForm();
    const [projects, setProjects] = useState<Project[]>([]);
    useEffect(() => {
        props.googleTokenExpirationTimeUpdate();
    }, []);
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

    if (googleTokenExpirationTime) {
        return <div>
            <div className='calendar-sync-div'>
                <Tooltip title='Log out Google Account'>
                    <Button
                        onClick={() => handleGoogleCalendarLogout()}><ApiOutlined/><span>{' '}Disconnect</span></Button>
                </Tooltip>
            </div>
            <div className='calendar-sync-div'>
                {getProjectSelections()}
            </div>
            <div className='calendar-sync-div'>
                <Card title="Calendar List">
                    {calendarList.map((calendar, index) => {
                        return <Card.Grid
                            className='grid-style'
                            style={{backgroundColor: calendar.backgroundColor, color: calendar.foregroundColor}}>
                            {calendar.summary}
                        </Card.Grid>;
                    })}
                </Card>
            </div>
        </div>;
    }

    return <div className='calendar-sync-div'>
        <Tooltip title='Enjoy a 2-way sync between your scheduled tasks and your Google Calendar'>
            <Button onClick={() => handleGoogleCalendarLogin()}><SwapOutlined/><span>{' '}Connect</span></Button>
        </Tooltip>;
    </div>
};

const mapStateToProps = (state: IState) => ({
    googleTokenExpirationTime: state.calendarSync.googleTokenExpirationTime,
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared,
    calendarList: state.calendarSync.googleCalendarList
});

export default connect(mapStateToProps, {googleTokenExpirationTimeUpdate})(GoogleCalendarSyncPage);
