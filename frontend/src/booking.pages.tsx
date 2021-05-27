import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {Avatar, BackTop, Tooltip} from "antd";

import './booking-link.pages.styles.less';
import {IState} from "./store";
import {connect} from "react-redux";
import {getBooking} from "./features/bookingLink/actions";
import {Booking} from "./features/bookingLink/interface";
import {getRandomBackgroundImage} from "./assets/background";
import {ClockCircleOutlined, SwapRightOutlined} from "@ant-design/icons";
import {getSlotSpan} from "./components/book-me/book-me-drawer";

type BookingLinkPublicProps = {
    booking: undefined | Booking;
    getBooking: (bookingId: string) => void;
}

const BookingPublicPage: React.FC<BookingLinkPublicProps> = (
    {
        booking,
        getBooking
    }) => {
    const {bookingId} = useParams();
    const fullHeight = global.window.innerHeight;

    useEffect(() => {
        bookingId && getBooking(bookingId);
    }, [bookingId]);

    if (!booking) {
        return <div></div>
    }
    return <div style={{backgroundImage: `url(${getRandomBackgroundImage()})`, height: `${fullHeight}px`}}
                className='public-container'>
            <div className='booking-link-div'>
            <BackTop/>
            <Tooltip
                placement="top"
                title={booking.bookingLink.ownerName}
                className="link-avatar"
            >
              <span>
                <Avatar size="large" src={booking.bookingLink.owner.avatar}/>
              </span>
            </Tooltip>
            <h1 className="book-me-drawer-header">
                <ClockCircleOutlined/> {getSlotSpan(booking.bookingLink.slotSpan)} Booking&nbsp;&nbsp;
                <span style={{fontSize: 'small'}}>
                    {booking.startTime} <SwapRightOutlined/>
                    {booking.endTime}&nbsp;&nbsp;({booking.requesterTimezone})
                </span>
            </h1>
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({
    booking: state.bookingReducer.booking
});

export default connect(mapStateToProps, {
    getBooking
})(BookingPublicPage);