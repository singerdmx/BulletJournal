import {IState} from "../../store";
import {connect} from "react-redux";
import React, {useEffect, useState} from "react";
import {
    AutoComplete,
    Avatar,
    Button,
    Checkbox,
    DatePicker,
    Drawer,
    Input,
    message,
    Popover,
    Select,
    Tooltip
} from "antd";
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
import {BookingLink, Invitee} from "../../features/bookingLink/interface";
import {
    CheckCircleOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    QuestionCircleOutlined,
    SwapRightOutlined
} from "@ant-design/icons";
import {Project} from "../../features/project/interface";
import {zones} from "../settings/constants";
import './book-me.styles.less';
import {iconMapper} from "../side-menu/side-menu.component";
import {patchBookingLink} from "../../features/bookingLink/actions";
import Quill, {DeltaStatic} from "quill";
import RecurringSpanCard from "./recurring-span-card.component";
import BookMeNoteEditor from "./book-me-note-editor";
import CopyToClipboard from "react-copy-to-clipboard";

const {Option} = Select;

const Delta = Quill.import('delta');

type BookMeDrawerProps = {
    bookMeDrawerVisible: boolean,
    setBookMeDrawerVisible: (v: boolean) => void;
    link: BookingLink | undefined;
    projects: Project[];
    patchBookingLink: (
        bookingLinkId: string,
        timezone: string,
        afterEventBuffer?: number,
        beforeEventBuffer?: number,
        endDate?: string,
        expireOnBooking?: boolean,
        includeTaskWithoutDuration?: boolean,
        location?: string,
        projectId?: number,
        startDate?: string,
        note?: string
    ) => void;
};

const {RangePicker} = DatePicker;

export const getSlotSpan = (slotSpan: number) => {
    if (slotSpan > 60) {
        const min = slotSpan % 60;
        const hr = Math.floor(slotSpan / 60);
        return (hr === 0 ? "" : hr + " Hour ") + (min === 0 ? "" : min + " Minute");
    } else if (slotSpan === 60) {
        return "1 Hour";
    } else {
        return slotSpan + " Minute";
    }
}
const BookMeDrawer: React.FC<BookMeDrawerProps> = (props) => {
    const {setBookMeDrawerVisible, bookMeDrawerVisible, link, projects, patchBookingLink} = props;
    const [location, setLocation] = useState();
    const [projectId, setProjectId] = useState();
    const [noteValue, setNoteValue] = useState<DeltaStatic>(new Delta());
    const result = ['5', '10', '15', '30', '45', '60'];
    const bufferOptions = result.map((time: string) => {
        return {value: time};
    });
    useEffect(() => {
        if (link) {
            setLocation(link.location);
            setProjectId(link.project.id);
        }
    }, [link])

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (link) {
                patchBookingLink(link.id, link.timezone, undefined,
                    undefined, undefined, undefined,
                    undefined, undefined, undefined,
                    undefined, JSON.stringify({delta: noteValue}));
            }
        }, 500)

        return () => clearTimeout(delayDebounceFn)
    }, [noteValue])

    const handleClose = () => {
        setBookMeDrawerVisible(false);
    };

    // @ts-ignore
    const fullHeight = global.window.innerHeight;
    // @ts-ignore
    const fullWidth = global.window.innerWidth;
    const drawerWidth =
        fullWidth > fullHeight ? fullWidth * 0.75 : fullWidth;

    const handleRangeChange = (dates: any, dateStrings: string[]) => {
        if (link) {
            patchBookingLink(link.id, link.timezone, undefined, undefined, dateStrings[1], undefined, undefined, undefined, undefined, dateStrings[0]);
        }
    };

    const handleTimezoneChange = (value: string) => {
        if (link) {
            patchBookingLink(link.id, value, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        }
    }

    const handleBeforeEventBufferChange = (value: any) => {
        if (link) {
            if (isNaN(value)) {
                value = 0;
            }
            patchBookingLink(link.id, link.timezone, undefined, value, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        }
    }

    const handleAfterEventBufferChange = (value: any) => {
        if (link) {
            if (isNaN(value)) {
                value = 0;
            }
            patchBookingLink(link.id, link.timezone, value, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
        }
    }

    const handleExpireOnBookingChange = (e: any) => {
        if (link) {
            patchBookingLink(link.id, link.timezone, undefined, undefined, undefined, e.target.checked, undefined, undefined, undefined, undefined);
        }
    }

    const handleProjectChange = (id: any) => {
        setProjectId(id);
        if (link) {
            patchBookingLink(link.id, link.timezone, undefined, undefined, undefined, undefined, undefined, undefined, id, undefined);
        }
    }

    const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLocation(e.target.value);
    };

    const handleLocationOnClick = (save: boolean) => {
        if (save && link) {
            patchBookingLink(link.id, link.timezone, undefined, undefined, undefined, undefined, undefined, location, undefined, undefined);
        } else {
            setLocation(link ? link.location : '');
        }
    };

    function getWhoBookedMe() {
        if (!link) {
            return <div/>
        }
        return link.bookings.map(booking => {
            return <div key={booking.id} className='booking-card'>
                <div>
                    {booking.displayDate} {booking.startTime} <SwapRightOutlined /> {booking.endTime} ({booking.requesterTimezone})
                </div>
                <div className='invitee-div'>
                    {booking.invitees.map((invitee: Invitee) => {
                        return <div>{invitee.firstName} {invitee.lastName} {invitee.email} {invitee.phone}</div>
                    })}
                </div>
            </div>
        });
    }

    if (link) {
        return <Drawer
            placement={'right'}
            onClose={(e) => handleClose()}
            visible={bookMeDrawerVisible}
            width={drawerWidth}
            destroyOnClose>
            <div className="book-me-drawer">
                <h1 className="book-me-drawer-header">
                    <ClockCircleOutlined/> {getSlotSpan(link.slotSpan)} Booking
                </h1>
                <div className="time-range booking-option-container">
                    <RangePicker
                        ranges={{
                            Today: [moment(), moment()],
                            'This Week': [moment().startOf('week'), moment().endOf('week')],
                            'This Month': [
                                moment().startOf('month'),
                                moment().endOf('month'),
                            ],
                        }}
                        value={
                            link.startDate ? [moment(link.startDate), moment(link.endDate)] : null
                        }
                        size="small"
                        allowClear={false}
                        format={dateFormat}
                        placeholder={['Start Date', 'End Date']}
                        onChange={handleRangeChange}
                        style={{height: "30px"}}
                    />
                    <Select
                        showSearch={true}
                        style={{width: 200, marginLeft: "40px"}}
                        placeholder='Select Time Zone'
                        onChange={handleTimezoneChange}
                        disabled={link.bookings.length > 0}
                        value={link.timezone}
                    >
                        {zones.map((zone: string) => (
                            <Option key={zone} value={zone} title={zone}>
                                {zone}
                            </Option>
                        ))}
                    </Select>
                </div>
                <div className="location booking-option-container">
                    <span style={{marginRight: "10px"}}>Where{' '}
                        <Tooltip
                            title={<span>Use the "Where" field to specify how and where both parties will connect at the scheduled time.<br/><br/>What is entered here will appear on the confirmation page after events are scheduled and in the calendar event added to both you and your invitee's calendars.</span>}
                        >
                            <span className="question-icon">
                                <QuestionCircleOutlined/>
                            </span>
                        </Tooltip>
                    </span>
                    <Input
                        placeholder="web link, phone number or address"
                        value={location ? location : ''}
                        style={{width: "250px"}}
                        onChange={(e) => handleLocationChange(e)}
                    />
                    <Tooltip placement='top' title='Save'>
                        <CheckCircleOutlined
                            onClick={() => handleLocationOnClick(true)}
                            style={{
                                marginLeft: '20px',
                                cursor: 'pointer',
                                color: '#00e600',
                                fontSize: 20,
                                visibility:
                                    link.location !== location
                                        ? 'visible'
                                        : 'hidden'

                            }}
                        />
                    </Tooltip>
                    <Tooltip placement='top' title='Cancel'>
                        <CloseCircleOutlined
                            onClick={() => handleLocationOnClick(false)}
                            style={{
                                marginLeft: '20px',
                                cursor: 'pointer',
                                color: '#ff0000',
                                fontSize: 20,
                                visibility:
                                    link.location !== location
                                        ? 'visible'
                                        : 'hidden'
                            }}
                        />
                    </Tooltip>
                </div>
                <span>Want to add time before or after your events?{' '}
                    <Tooltip
                        title="Give yourself some buffer time to prepare or wrap-up before or after booked events.">
                        <span className="question-icon">
                                    <QuestionCircleOutlined/>
                        </span>
                    </Tooltip>
                </span>
                <div className="buffer booking-option-container"
                     style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "350px"}}>
                    <div style={{textAlign: "center"}}>
                        <div> Before event (Minutes){' '}</div>
                        <AutoComplete
                            style={{width: "50px"}}
                            options={bufferOptions}
                            value={link.beforeEventBuffer.toString()}
                            onChange={handleBeforeEventBufferChange}
                        >
                            <Input/>
                        </AutoComplete>
                    </div>
                    <div style={{textAlign: "center"}}>
                        <div> After event (Minutes){' '}</div>
                        <AutoComplete
                            style={{width: "50px"}}
                            options={bufferOptions}
                            value={link.afterEventBuffer.toString()}
                            onChange={handleAfterEventBufferChange}
                        >
                            <Input/>
                        </AutoComplete>
                    </div>
                </div>
                <div className="checkboxes booking-option-container">
                    <Checkbox
                        checked={link.expireOnBooking}
                        onChange={handleExpireOnBookingChange}>
                        Expire this once a booking is made
                    </Checkbox>
                </div>
                <div className="booking-project booking-option-container">
                    <span style={{marginRight: "10px"}}> Save booked event in{' '}
                        <Tooltip
                            title="Once a booking is made,  a task is created under this BuJo">
                                <span className="question-icon">
                                <QuestionCircleOutlined/>
                            </span>
                        </Tooltip>
                    </span>
                    <Select
                        style={{width: '256px'}}
                        placeholder='Select BuJo'
                        value={projectId}
                        onChange={
                            (id) => handleProjectChange(id)}
                    >
                        {projects.map((project) => {
                            return (
                                <Option value={project.id} key={project.id}>
                                    <Tooltip
                                        title={`${project.name} (Group ${project.group.name})`}
                                        placement='left'
                                    >
                          <span>
                            <Avatar size='small' src={project.owner.avatar}/>
                              &nbsp; {iconMapper[project.projectType]}
                              &nbsp; <strong>{project.name}</strong>
                              &nbsp; (Group <strong>{project.group.name}</strong>)
                          </span>
                                    </Tooltip>
                                </Option>
                            );
                        })}
                    </Select>
                </div>
                <div className='dns-panel'>
                    <div className='dns-panel-title'>
                        <b>DO NOT SCHEDULE</b>&nbsp;&nbsp;
                        <Tooltip
                            title="Unavailable time on calendar">
                                    <span className="question-icon">
                                    <QuestionCircleOutlined/>
                                </span>
                        </Tooltip>
                    </div>
                    <div className='recurring-span-cards'>
                        <RecurringSpanCard
                            index={-1} mode='add'
                            originalRecurrenceRule={"DTSTART:" + moment().format('YYYYMMDD') + "T000000Z\nRRULE:FREQ=DAILY;INTERVAL=1"}
                            duration={540} backgroundColor={'#CB8A90'}/>
                        {link.recurrences.map((recurrence, index) => <RecurringSpanCard
                            index={index}
                            mode='card' originalRecurrenceRule={recurrence.recurrenceRule} duration={recurrence.duration} backgroundColor={'#CB8A90'}/>)}
                    </div>
                </div>
                <BookMeNoteEditor
                    delta={link.note ? JSON.parse(link.note)['delta'] : new Delta()}
                    onContentChange={(delta: DeltaStatic) => setNoteValue(delta)}
                    height={160}/>
                <div className="buttons-div">
                    <div className="buttons">
                        <Button
                            type="primary"
                            shape="round"
                            style={{width: "100px"}}
                            onClick={() => window.open(`${window.location.protocol}//${window.location.host}/#/bookingLinks/${link!.id}`)}
                        >
                            Preview
                        </Button>
                        {link && link.bookings && link.bookings.length > 0 && <Popover content={getWhoBookedMe()} title="Events">
                            <Button
                                type="primary"
                                shape="round"
                                style={{width: "150px"}}
                            >
                                Who booked me
                            </Button>
                        </Popover>}
                        <CopyToClipboard
                            text={`${window.location.protocol}//${window.location.host}/public/bookingLinks/${link!.id}`}
                            onCopy={() => message.success('Sharable link copied to clipboard')}
                        >
                            <Button
                                type="primary"
                                shape="round"
                                style={{width: "100px"}}
                                onClick={() => {
                                    setTimeout(() => {
                                        window.open(`${window.location.protocol}//${window.location.host}/public/bookingLinks/${link!.id}`);
                                    }, 2000);
                                }}
                            >
                                Share
                            </Button>
                        </CopyToClipboard>
                    </div>
                </div>
            </div>
        </Drawer>
    }

    return <></>;
};

const mapStateToProps = (state: IState) => ({
    link: state.bookingReducer.link,
});

export default connect(mapStateToProps, {
    patchBookingLink,
})(BookMeDrawer);
