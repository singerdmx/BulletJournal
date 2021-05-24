import React, {useEffect, useState} from "react";
import {Calendar, Tooltip} from "antd";

import './book-me-calendar.styles.less';
import moment from "moment";
import {BookingLink, Slot} from "../../features/bookingLink/interface";
import {CheckCircleOutlined, CloseCircleOutlined, SwapRightOutlined} from "@ant-design/icons";
import {inPublicPage} from "../../index";
import {IState} from "../../store";
import {connect} from "react-redux";
import {updateBookingLinkSlot} from "../../features/bookingLink/actions";

type BookMeCalendarProps = {
    link: BookingLink,
    updateBookingLinkSlot: (bookingLinkId: string, slot: Slot, timezone: string) => void;
}

const BookMeCalendar: React.FC<BookMeCalendarProps> = (
    {
        link,
        updateBookingLinkSlot
    }
) => {
    const isPublic = inPublicPage();
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
                        // onClick={() => this.handleOnThemeClick(true)}
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

    return <div className='book-me-calendar'>
        <div className='calendar-div'>
            <Calendar fullscreen={false}
                      value={selectedDate}
                      validRange={[moment(link.startDate), moment(link.endDate).endOf('month').add(25, 'days')]}
                      onSelect={onDateChange}/>
        </div>
        <div className='selector-div'>
            <div className='slots'>
                {slots.map(slot => {
                    return <div className='slot-card' onClick={() => handleOnSlotClick(slot)}>
                        <div className='slot' style={{backgroundColor: `${slot.on ? '#52c41a' : '#f78cba'}`}}>
                            {slot.startTime}<SwapRightOutlined/>{slot.endTime}
                        </div>
                        {getSlotButtons(slot)}
                    </div>
                })}
            </div>
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {
    updateBookingLinkSlot
})(BookMeCalendar);