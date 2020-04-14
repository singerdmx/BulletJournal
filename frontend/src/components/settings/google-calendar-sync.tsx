import React, {useEffect} from 'react';
import {Button, Card, Tabs, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {loginGoogleCalendar, logoutGoogleCalendar} from '../../apis/calendarApis';
import {googleTokenExpirationTimeUpdate} from "../../features/calendarSync/actions";
import {ApiOutlined, SwapOutlined} from '@ant-design/icons';
import './calendar-sync.styles.less';
import {IState} from "../../store";
import {CalendarListEntry} from "../../features/calendarSync/interface";
import CalendarListEntryModal from "../modals/calendar-list-entry.component";

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
    googleTokenExpirationTimeUpdate: () => void;
};

const GoogleCalendarSyncPage: React.FC<SettingProps> = (props) => {
    const {googleTokenExpirationTime, calendarList} = props;

    useEffect(() => {
        props.googleTokenExpirationTimeUpdate();
    }, []);

    if (googleTokenExpirationTime) {
        return <div>
            <div className='calendar-sync-div'>
                <Tooltip title='Log out Google Account'>
                    <Button
                        onClick={() => handleGoogleCalendarLogout()}><ApiOutlined/><span>{' '}Disconnect</span></Button>
                </Tooltip>
            </div>
            <div className='calendar-sync-div'>
                <Card title="Calendar List">
                    {calendarList.map((calendar, index) => {
                        return <Card.Grid
                            className='grid-style'
                            style={{backgroundColor: calendar.backgroundColor, color: calendar.foregroundColor}}>
                            <CalendarListEntryModal calendar={calendar}/>
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
    calendarList: state.calendarSync.googleCalendarList
});

export default connect(mapStateToProps, {googleTokenExpirationTimeUpdate})(GoogleCalendarSyncPage);
