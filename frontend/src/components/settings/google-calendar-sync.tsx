import React, {useEffect, useState} from 'react';
import {Button, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {loginGoogleCalendar, logoutGoogleCalendar} from '../../apis/calendarApis';
import {googleTokenExpirationTimeUpdate} from "../../features/calendarSync/actions";
import {DisconnectOutlined, SwapOutlined} from '@ant-design/icons';
import './calendar-sync.styles.less';
import {IState} from "../../store";
import {CalendarListEntry} from "../../features/calendarSync/interface";
import CalendarListEntryModal from "../modals/calendar-list-entry.component";
import {Project, ProjectsWithOwner} from "../../features/project/interface";
import {flattenOwnedProject, flattenSharedProject} from "../../pages/projects/projects.pages";
import {ProjectType} from "../../features/project/constants";

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
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
    googleTokenExpirationTime: number;
    calendarList: CalendarListEntry[];
    googleTokenExpirationTimeUpdate: () => void;
};

const GoogleCalendarSyncPage: React.FC<SettingProps> = (props) => {
    const {googleTokenExpirationTime, calendarList} = props;
    const [projects, setProjects] = useState<Project[]>([]);

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
        props.googleTokenExpirationTimeUpdate();
    }, []);

    if (googleTokenExpirationTime) {
        return <div>
            <div className='calendar-sync-div'>
                <Tooltip title='Log out Google Account'>
                    <Button
                        onClick={() => handleGoogleCalendarLogout()}><DisconnectOutlined/><span>{' '}Disconnect</span></Button>
                </Tooltip>
            </div>
            <div className='calendar-sync-div'>
                {calendarList.map((calendar, index) => {
                    return <CalendarListEntryModal calendar={calendar} projects={projects}/>
                })}
            </div>
        </div>;
    }

    return <div className='calendar-sync-div'>
        <Tooltip title='Enjoy a 2-way sync between your scheduled tasks and your Google Calendar'>
            <Button onClick={() => handleGoogleCalendarLogin()}><SwapOutlined/><span>{' '}Connect</span></Button>
        </Tooltip>
    </div>
};

const mapStateToProps = (state: IState) => ({
    googleTokenExpirationTime: state.calendarSync.googleTokenExpirationTime,
    calendarList: state.calendarSync.googleCalendarList,
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared,
});

export default connect(mapStateToProps, {googleTokenExpirationTimeUpdate})(GoogleCalendarSyncPage);
