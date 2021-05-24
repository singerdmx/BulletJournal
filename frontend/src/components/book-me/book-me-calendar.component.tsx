import React, {useState} from "react";
import {Calendar} from "antd";

import './book-me-calendar.styles.less';
import moment from "moment";
import {BookingLink} from "../../features/bookingLink/interface";
import {SwapRightOutlined} from "@ant-design/icons";

type BookMeCalendarProps = {
    link: BookingLink
}

const BookMeCalendar: React.FC<BookMeCalendarProps> = (
    {
        link
    }
) => {
    const [selectedDate, setSelectedDate] = useState(moment(link.startDate));
    const [slots, setSlots] = useState(link.slots.filter(d => d.displayDate === link.startDate));

    function onDateChange(date: moment.Moment) {
        if (date.isAfter(moment(link.endDate))) {
            date = moment(link.endDate);
        }
        if (date.isBefore(moment(link.startDate))) {
            date = moment(link.startDate);
        }
        setSelectedDate(date);
        setSlots(link.slots.filter(d => d.displayDate === date.format('YYYY-MM-DD')));
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
                    return <div className='slot' style={{backgroundColor: `${slot.on ? '#52c41a' : '#f78cba'}`}}>
                        {slot.startTime}<SwapRightOutlined />{slot.endTime}
                    </div>
                })}
            </div>
        </div>
    </div>
}

export default BookMeCalendar;