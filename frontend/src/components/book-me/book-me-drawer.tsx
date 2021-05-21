import {IState} from "../../store";
import {connect} from "react-redux";
import React, {useEffect, useState} from "react";
import {AutoComplete, Avatar, Button, Checkbox, DatePicker, Drawer, Input, Select, Tooltip} from "antd";
import moment from "moment";
import {dateFormat} from "../../features/myBuJo/constants";
import {BookingLink} from "../../features/bookingLink/interface";
import {ClockCircleOutlined, QuestionCircleOutlined} from "@ant-design/icons";
import {Project} from "../../features/project/interface";
import {zones} from "../settings/constants";
import './book-me.styles.less';
import {iconMapper} from "../side-menu/side-menu.component";

const {Option} = Select;

type BookMeDrawerProps = {
    bookMeDrawerVisible: boolean,
    setBookMeDrawerVisible: (v: boolean) => void;
    link: BookingLink | undefined;
    projects: Project[];
};

const {RangePicker} = DatePicker;

const BookMeDrawer: React.FC<BookMeDrawerProps> = (props) => {
    const {setBookMeDrawerVisible, bookMeDrawerVisible, link, projects} = props;
    const [dateArray, setDateArray] = useState(['', '']);
    const [location, setLocation] = useState();
    const [timezone, setTimezone] = useState();
    const [afterEventBuffer, setAfterEventBuffer] = useState();
    const [beforeEventBuffer, setBeforeEventBuffer] = useState();
    const [project, setProject] = useState();
    const [expireOnBooking, setExpireOnBooking] = useState();
    const [includeTaskWithoutDuration, setIncludeTaskWithoutDuration] = useState();
    const result = ['15', '30', '45', '60'];
    const options = result.map((time: string) => {
        return {value: time};
    });
    console.log(project)
    useEffect(() => {
        if (link) {
            setLocation(link.location);
            setDateArray([link.startDate, link.endDate]);
            setTimezone(link.timezone);
            setAfterEventBuffer(link.afterEventBuffer);
            setBeforeEventBuffer(link.beforeEventBuffer);
            setProject(link.project.id);
            setExpireOnBooking(link.expireOnBooking);
            setIncludeTaskWithoutDuration(link.includeTaskWithoutDuration);
        }
    }, [link])

    const handleClose = () => {
        setBookMeDrawerVisible(false);
    };

    // @ts-ignore
    const fullHeight = global.window.innerHeight;
    // @ts-ignore
    const fullWidth = global.window.innerWidth;
    const drawerWidth =
        fullWidth > fullHeight ? fullWidth * 0.75 : fullWidth;

    const getSlotSpan = (slotSpan: number) => {
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

    const handleRangeChange = (dates: any, dateStrings: string[]) => {
        setDateArray([dateStrings[0], dateStrings[1]]);
    };

    const handleTimezoneChange = (value: string) => {
        setTimezone(value);
    }

    const handleBeforeEventBufferChange = (value: any) => {
        setBeforeEventBuffer(value);
    }

    const handleAfterEventBufferChange = (value: any) => {
        setAfterEventBuffer(value);
    }

    const handleLocationChange = (inputLocation: string) => {
        setLocation(inputLocation);
    };

    const handleExpireOnBookingChange = (e: any) => {
        setExpireOnBooking(e.target.checked);
    }

    const handleProjectChange = (id: any) => {
        setProject(id);
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
                            dateArray[0] ? [moment(dateArray[0]), moment(dateArray[1])] : null
                        }
                        size="small"
                        allowClear={true}
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
                        value={timezone}
                    >
                        {zones.map((zone: string) => (
                            <Option key={zone} value={zone} title={zone}>
                                {zone}
                            </Option>
                        ))}
                    </Select>
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
                     style={{display: "flex", flexDirection: "row", justifyContent: "space-between", width: "300px"}}>
                    <div>
                        <div> Before event{' '}</div>
                        <AutoComplete
                            style={{width: "100px"}}
                            options={options}
                            value={beforeEventBuffer ? beforeEventBuffer : 0}
                            onChange={handleBeforeEventBufferChange}
                        >
                            <Input/>
                        </AutoComplete>
                    </div>
                    <div>
                        <div> After event{' '}</div>
                        <AutoComplete
                            style={{width: "100px"}}
                            options={options}
                            value={afterEventBuffer ? afterEventBuffer : 0}
                            onChange={handleAfterEventBufferChange}
                        >
                            <Input/>
                        </AutoComplete>
                    </div>
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
                        placeholder="web link, phone number or physical address"
                        value={location}
                        style={{width: "350px"}}
                        onChange={(e) => handleLocationChange(e.target.value)}
                    />
                </div>
                <div className="checkboxes booking-option-container">
                    <Checkbox
                        checked={expireOnBooking}
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
                        value={project}
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
                <div className="buttons" style={{marginTop: "50px", paddingTop: "10px"}}>
                    <Button
                        type="primary"
                        shape="round"
                        style={{marginRight: "50px", width: "100px"}}
                    >
                        Preview
                    </Button>
                    <Button
                        type="primary"
                        shape="round"
                        style={{width: "100px"}}
                    >
                        Share
                    </Button>
                </div>
            </div>
        </Drawer>
    }

    return <></>;
};

const mapStateToProps = (state: IState) => ({
    link: state.bookingReducer.link,
});

export default connect(mapStateToProps, {})(BookMeDrawer);
