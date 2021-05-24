import React from "react";
import {Calendar} from "antd";

import './book-me-calendar.styles.less';

type BookMeCalendarProps = {
}

const BookMeCalendar: React.FC<BookMeCalendarProps> = (props) => {
    return <div className='book-me-calendar'>
        <div className='calendar-div'>
            <Calendar fullscreen={false} mode='month'/>
        </div>
        <div className='selector-div'>
        </div>
    </div>
}

export default BookMeCalendar;