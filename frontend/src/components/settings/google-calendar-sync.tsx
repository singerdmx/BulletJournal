import React, {useEffect} from 'react';
import {Button, Tabs, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {loginGoogleCalendar, logoutGoogleCalendar} from '../../apis/calendarApis';
import {googleTokenExpirationTimeUpdate} from "../../features/calendarSync/actions";
import {ApiOutlined, SwapOutlined} from '@ant-design/icons';
import './calendar-sync.styles.less';
import {IState} from "../../store";
import {Project, ProjectsWithOwner} from "../../features/project/interface";

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
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
    googleTokenExpirationTimeUpdate: () => void;
};

const GoogleCalendarSyncPage: React.FC<SettingProps> = (props) => {
    const {googleTokenExpirationTime} = props;
    useEffect(() => {
        props.googleTokenExpirationTimeUpdate();
    }, []);

    if (googleTokenExpirationTime) {
        return <Tooltip title='Log out Google Account'>
            <Button onClick={() => handleGoogleCalendarLogout()}><ApiOutlined/><span>{' '}Disconnect</span></Button>
        </Tooltip>;
    }

    return <Tooltip title='Enjoy a 2-way sync between your scheduled tasks and your Google Calendar'>
        <Button onClick={() => handleGoogleCalendarLogin()}><SwapOutlined/><span>{' '}Connect</span></Button>
    </Tooltip>;
};

const mapStateToProps = (state: IState) => ({
    googleTokenExpirationTime: state.calendarSync.googleTokenExpirationTime,
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared
});

export default connect(mapStateToProps, {googleTokenExpirationTimeUpdate})(GoogleCalendarSyncPage);
