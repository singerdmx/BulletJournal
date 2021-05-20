import {IState} from "../../store";
import {connect} from "react-redux";
import React, {useState} from "react";
import {Drawer} from "antd";
import {addBookingLink} from "../../features/bookingLink/actions";
import moment from "moment-timezone";
import {dateFormat} from "../../features/myBuJo/constants";
import {RecurringSpan} from "../../features/bookingLink/interface";

type BookMeDrawerProps = {
    slotSpan: number,
    timezone: string,
    bookMeDrawerVisible: boolean,
    setBookMeDrawerVisible:(v:boolean) => void;
    addBookingLink:(
        bufferInMin: number,
        endDate: string,
        expireOnBooking: boolean,
        includeTaskWithoutDuration: boolean,
        projectId: number,
        recurrences: RecurringSpan[],
        slotSpan: number,
        startDate: string,
        timezone: string
    )=>void;
};

const BookMeDrawer: React.FC<BookMeDrawerProps> = (props) => {
    const {slotSpan, timezone, setBookMeDrawerVisible, bookMeDrawerVisible, addBookingLink} = props;
    // tomorrow
    const startDate = moment().add(1,'days').format(dateFormat);
    // end of next month
    const endDate = moment().add(1, 'month').endOf('month').format(dateFormat);
    const today = moment().format('YYYYMMDD');

    const recurringSpan1 : RecurringSpan= {
        duration: 540,
        recurrenceRule:"DTSTART:"+ today + "T000000Z RRULE:FREQ=DAILY;INTERVAL=1"
    }

    const recurringSpan2 : RecurringSpan = {
        duration: 420,
        recurrenceRule: "DTSTART:" + today +"T170000Z RRULE:FREQ=DAILY;INTERVAL=1"
    }
    const recurrences = [recurringSpan1,recurringSpan2];

    const createBooking = () => {
        addBookingLink(0, endDate, true, false, 11, recurrences, slotSpan, startDate, timezone)
    }

    const handleClose = (e: React.KeyboardEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement | HTMLButtonElement, MouseEvent>) => {
        setBookMeDrawerVisible(false);
    };

    // @ts-ignore
    const fullHeight = global.window.innerHeight;
    // @ts-ignore
    const fullWidth = global.window.innerWidth;
    const drawerWidth =
        fullWidth > fullHeight ? fullWidth * 0.75 : fullWidth;

    return <Drawer
        placement={'right'}
        onClose={(e) => handleClose(e)}
        visible={bookMeDrawerVisible}
        width={drawerWidth}
        destroyOnClose>
        <div>
            <button onClick={createBooking}>Create Booking</button>
        </div>
    </Drawer>
};

const mapStateToProps = (state: IState) => ({
    timezone: state.myself.timezone,
});

export default connect(mapStateToProps, {
    addBookingLink,
})(BookMeDrawer);
