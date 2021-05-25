import React, {useEffect, useState} from "react";
import {Button, Calendar, Drawer, Input, Tooltip} from "antd";

import './book-me-calendar.styles.less';
import moment from "moment";
import {BookingLink, Slot} from "../../features/bookingLink/interface";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined,
    QuestionCircleOutlined,
    SwapRightOutlined,
    UserAddOutlined
} from "@ant-design/icons";
import {inPublicPage} from "../../index";
import {IState} from "../../store";
import {connect} from "react-redux";
import {updateBookingLinkSlot} from "../../features/bookingLink/actions";
import BookMeNoteEditor from "./book-me-note-editor";
import Quill, {DeltaStatic} from "quill";

type BookMeCalendarProps = {
    link: BookingLink,
    updateBookingLinkSlot: (bookingLinkId: string, slot: Slot, timezone: string) => void;
}

const Delta = Quill.import('delta');

const BookMeCalendar: React.FC<BookMeCalendarProps> = (
    {
        link,
        updateBookingLinkSlot
    }
) => {
    const isPublic = inPublicPage();
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment(link.startDate));
    const [slots, setSlots] = useState(link.slots.filter(d => {
        if (isPublic && !d.on) {
            return false;
        }
        return d.displayDate === link.startDate;
    }));
    const [visibleSlot, setVisibleSlot] = useState('');

    useEffect(() => {
        setVisibleSlot('');
        setSlots(link.slots.filter(d => {
            if (isPublic && !d.on) {
                return false;
            }
            return d.displayDate === selectedDate.format('YYYY-MM-DD')
        }));
    }, [link]);

    function onDateChange(date: moment.Moment) {
        setVisibleSlot('');
        if (date.isAfter(moment(link.endDate))) {
            date = moment(link.endDate);
        }
        if (date.isBefore(moment(link.startDate))) {
            date = moment(link.startDate);
        }
        setSelectedDate(date);
        setSlots(link.slots.filter(d => {
            if (isPublic && !d.on) {
                return false;
            }
            return d.displayDate === date.format('YYYY-MM-DD')
        }));
    }

    function handleOnSlotClick(slot: Slot) {
        setVisibleSlot(slot.date + '#' + slot.index);
    }

    function markSlot(slot: Slot, on: boolean) {
        setVisibleSlot('');
        // send API request to mark
        slot = {...slot};
        slot.on = on;
        updateBookingLinkSlot(link.id, slot, link.timezone);
    }

    function getSlotButtons(slot: Slot) {
        if (slot.date + '#' + slot.index !== visibleSlot) {
            return <></>;
        }
        if (isPublic) {
            return <div className='slot-button'>
                <Tooltip placement="top" title="Book">
                    <CheckCircleOutlined
                        onClick={() => setDrawerVisible(true)}
                        style={{
                            marginLeft: '20px',
                            cursor: 'pointer',
                            color: '#00e600',
                            fontSize: 20
                        }}
                    />
                </Tooltip>
            </div>
        }

        if (slot.on) {
            return <div className='slot-button'>
                <Tooltip placement="top" title="Change to unavailable">
                    <CloseCircleOutlined
                        onClick={() => markSlot(slot, false)}
                        style={{
                            marginLeft: '20px',
                            cursor: 'pointer',
                            color: '#ff0000',
                            fontSize: 20,
                        }}
                    />
                </Tooltip>
            </div>
        }
        return <div className='slot-button'>
                <Tooltip placement="top" title="Change to available">
                    <CheckCircleOutlined
                        onClick={() => markSlot(slot, true)}
                        style={{
                            marginLeft: '20px',
                            cursor: 'pointer',
                            color: '#00e600',
                            fontSize: 20,
                        }}
                    />
                </Tooltip>
            </div>;
    }

    function getSelectedSlot() {
        let slot = slots.filter(slot => slot.date + '#' + slot.index === visibleSlot)[0];
        if (!slot) {
            slot = slots[0];
        }
        return slot;
    }

    return <div className='book-me-calendar'>
        <div className='calendar-div'>
            <Calendar fullscreen={false}
                      value={selectedDate}
                      validRange={[moment(link.startDate), moment(link.endDate).endOf('month').add(25, 'days')]}
                      onSelect={onDateChange}/>
        </div>
        <div className='selector-div'>
            <div className='slots'>
                {slots.map((slot, i) => {
                    return <div key={i} className='slot-card' onClick={() => handleOnSlotClick(slot)}>
                        <div className='slot' style={{backgroundColor: `${slot.on ? '#52c41a' : '#f78cba'}`}}>
                            {slot.startTime}<SwapRightOutlined/>{slot.endTime}
                        </div>
                        {getSlotButtons(slot)}
                    </div>
                })}
            </div>
        </div>
        <div>
            <Drawer
                title={<span style={{color: '#52c41a'}}>
                    <InfoCircleOutlined /> Enter details for {selectedDate.format('YYYY-MM-DD')}&nbsp;&nbsp;
                    {getSelectedSlot().startTime} <SwapRightOutlined /> {getSelectedSlot().endTime}
                </span>}
                placement='top'
                closable={true}
                destroyOnClose={true}
                onClose={() => setDrawerVisible(false)}
                visible={drawerVisible}
                key='confirm_booking'
                height='90vh'
            >
                <div className='enter-details'>
                    <div className='enter-names'>
                        <div>
                            <Input addonBefore="Email" style={{ width: 200 }} placeholder='Required'/>
                        </div>
                        <div>
                            <Input addonBefore="First Name" style={{ width: 200 }} placeholder='Required'/>
                        </div>
                        <div>
                            <Input addonBefore="Last Name" style={{ width: 200 }} placeholder='Required'/>
                        </div>
                        <div>
                            <Input addonBefore="Phone" style={{ width: 150 }} placeholder='Optional'/>
                        </div>
                    </div>
                    <div className='add-guest-button'>
                        <div>
                            <Button type="primary" shape="round" icon={<UserAddOutlined />}>
                                Add Guests
                            </Button>
                        </div>
                    </div>
                    <div className='location'>
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
                            value={link.location ? link.location : ''}
                            style={{width: "250px"}}
                            onChange={(e) => console.log(e)}
                        />
                    </div>
                    <div className='note'>
                        <BookMeNoteEditor
                            delta={link.note ? JSON.parse(link.note)['delta'] : new Delta()}
                            saveContent={(delta: DeltaStatic) => console.log(delta)}/>
                    </div>
                    <div className='schedule-button'>
                        <div>
                            <Button type="primary" shape="round">
                                Schedule Event
                            </Button>
                        </div>
                    </div>
                </div>

            </Drawer>
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {
    updateBookingLinkSlot
})(BookMeCalendar);