import React, {useEffect, useState} from "react";
import {Badge, Button, Calendar, Drawer, Input, message, Result, Tooltip} from "antd";

import './book-me-calendar.styles.less';
import moment from "moment";
import {BookingLink, Invitee, Slot} from "../../features/bookingLink/interface";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    InfoCircleOutlined,
    MinusCircleOutlined,
    QuestionCircleOutlined,
    SwapRightOutlined,
    UserAddOutlined
} from "@ant-design/icons";
import {inPublicPage} from "../../index";
import {IState} from "../../store";
import {connect} from "react-redux";
import {book, updateBookingLinkSlot} from "../../features/bookingLink/actions";
import BookMeNoteEditor from "./book-me-note-editor";
import Quill from "quill";

type BookMeCalendarProps = {
    link: BookingLink,
    updateBookingLinkSlot: (bookingLinkId: string, slot: Slot, timezone: string) => void;
    book: (
        bookingLinkId: string,
        invitees: Invitee[],
        slotIndex: number,
        slotDate: string,
        location: string,
        note: string,
        requesterTimezone: string,
        onSuccess: (bookingId: string) => void
    ) => void;
}

const Delta = Quill.import('delta');

const BookMeCalendar: React.FC<BookMeCalendarProps> = (
    {
        link,
        updateBookingLinkSlot,
        book
    }
) => {
    const isPublic = inPublicPage();
    const [showError, setShowError] = useState(false);
    const [drawerVisible, setDrawerVisible] = useState(false);
    const [selectedDate, setSelectedDate] = useState(moment(link.startDate));
    const [location, setLocation] = useState(link.location ? link.location : '');
    const [note, setNote] = useState(link.note ? JSON.parse(link.note)['delta'] : new Delta());
    const [invitees, setInvitees] = useState<Invitee[]>([{
        firstName: '',
        lastName: '',
        email: '',
        phone: ''
    }])
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

    function isInvalid(index: number, invitee: Invitee, field: string) {
        if ((!field || field === 'email') &&
            (!invitee.email || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(invitee.email))) {
            return true;
        }
        if ((!field || field === 'lastName') && index === 0 && !invitee.lastName) {
            return true;
        }
        if ((!field || field === 'firstName') && index === 0 && !invitee.firstName) {
            return true;
        }

        return false;
    }

    function getCalendarDiv() {
        return <>
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
                    <InfoCircleOutlined/> Enter details for {selectedDate.format('YYYY-MM-DD')}&nbsp;&nbsp;
                        {getSelectedSlot().startTime} <SwapRightOutlined/> {getSelectedSlot().endTime}
                </span>}
                    placement='top'
                    closable={true}
                    destroyOnClose={true}
                    onClose={() => setDrawerVisible(false)}
                    visible={drawerVisible}
                    key='confirm_booking'
                    height='65vh'
                >
                    <div className='enter-details'>
                        {invitees.map((invitee, index) => {
                            return <div key={index} className='enter-names'>
                                <div className='remove-button' style={{visibility: index === 0 ? 'hidden' : 'inherit'}}>
                                    <Tooltip title='Remove'>
                                        <MinusCircleOutlined onClick={() => {
                                            const arr = [...invitees];
                                            arr.splice(index, 1);
                                            setInvitees(arr);
                                        }}/>
                                    </Tooltip>
                                </div>
                                <div>
                                    {showError && isInvalid(index, invitee, 'email') && <Badge dot={true} color='red'/>}
                                    <Input addonBefore="Email" style={{width: 240}} placeholder='Required'
                                           value={invitee.email}
                                           onChange={(e) => {
                                               const arr = [...invitees];
                                               arr[index].email = e.target.value;
                                               setInvitees(arr);
                                           }}/>
                                </div>
                                <div>
                                    {showError && isInvalid(index, invitee, 'firstName') &&
                                    <Badge dot={true} color='red'/>}
                                    <Input addonBefore="First Name" style={{width: 180}}
                                           placeholder={`${index === 0 ? 'Required' : 'Optional'}`}
                                           value={invitee.firstName}
                                           onChange={(e) => {
                                               const arr = [...invitees];
                                               arr[index].firstName = e.target.value;
                                               setInvitees(arr);
                                           }}/>
                                </div>
                                <div>
                                    {showError && isInvalid(index, invitee, 'lastName') &&
                                    <Badge dot={true} color='red'/>}
                                    <Input addonBefore="Last Name" style={{width: 180}}
                                           placeholder={`${index === 0 ? 'Required' : 'Optional'}`}
                                           value={invitee.lastName}
                                           onChange={(e) => {
                                               const arr = [...invitees];
                                               arr[index].lastName = e.target.value;
                                               setInvitees(arr);
                                           }}/>
                                </div>
                                <div>
                                    <Input addonBefore="Phone" style={{width: 180}} placeholder='Optional'
                                           value={invitee.phone}
                                           onChange={(e) => {
                                               const arr = [...invitees];
                                               arr[index].phone = e.target.value;
                                               setInvitees(arr);
                                           }}/>
                                </div>
                            </div>
                        })}
                        <div className='add-guest-button'>
                            <div>
                                <Button type="primary"
                                        shape="round"
                                        onClick={() => {
                                            const arr = [...invitees];
                                            arr.push({
                                                firstName: '',
                                                lastName: '',
                                                email: '',
                                                phone: ''
                                            });
                                            setInvitees(arr);
                                        }}
                                        icon={<UserAddOutlined/>}>
                                    Add Guest
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
                                value={location}
                                style={{width: "250px"}}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className='note'>
                            <BookMeNoteEditor
                                delta={note}
                                height={200}
                                onContentChange={(delta) => setNote(delta)}
                            />
                        </div>
                        <div className='schedule-button'>
                            <div>
                                <Button type="primary" shape="round"
                                        onClick={() => {
                                            setShowError(true);
                                            const found = invitees.find((invitee, index) => isInvalid(index, invitee, ""));
                                            if (found) {
                                                return;
                                            }
                                            book(link.id, invitees, parseInt(visibleSlot.split('#')[1]),
                                                visibleSlot.split('#')[0], location, JSON.stringify({
                                                    delta: note
                                                }),
                                                Intl.DateTimeFormat().resolvedOptions().timeZone,
                                                (bookingId) => {
                                                    message.success('A calendar invitation has been sent to your email address.');
                                                    // go to reschedule/cancel page
                                                });
                                            setDrawerVisible(false);
                                        }}>
                                    Schedule Event
                                </Button>
                            </div>
                        </div>
                    </div>

                </Drawer>
            </div>
        </>;
    }

    function getRemovedDiv() {
        return <Result
            status="404"
            title="Sorry, the page you visited no longer exists"
            subTitle="It is likely that the link expired after a booking is made"
            extra={<Button type="primary" onClick={() => window.open('https://bulletjournal.us/home/index.html')}>Home</Button>}
        />
    }

    return <div className='book-me-calendar'>
        {!link.removed && getCalendarDiv()}
        {link.removed && getRemovedDiv()}
    </div>
}

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {
    updateBookingLinkSlot,
    book
})(BookMeCalendar);