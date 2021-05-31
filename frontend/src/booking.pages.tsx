import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {Avatar, BackTop, Button, message, Result, Tooltip} from "antd";

import './booking-link.pages.styles.less';
import {IState} from "./store";
import {connect} from "react-redux";
import {cancelBooking, getBooking} from "./features/bookingLink/actions";
import {Booking} from "./features/bookingLink/interface";
import {getRandomBackgroundImage} from "./assets/background";
import {ClockCircleFilled, ClockCircleOutlined, SwapRightOutlined} from "@ant-design/icons";
import {getSlotSpan} from "./components/book-me/book-me-drawer";

type BookingLinkPublicProps = {
    booking: undefined | Booking;
    getBooking: (bookingId: string) => void;
    cancelBooking: (bookingId: string, name: string, onSuccess: Function) => void;
}

const BookingPublicPage: React.FC<BookingLinkPublicProps> = (
    {
        booking,
        getBooking,
        cancelBooking
    }) => {
    const {bookingId} = useParams();
    const fullHeight = global.window.innerHeight;

    useEffect(() => {
        bookingId && getBooking(bookingId);
    }, [bookingId]);

    if (!booking) {
        return <div style={{backgroundImage: `url(${getRandomBackgroundImage()})`, height: `${fullHeight}px`}}
                    className='public-container'>
            <div className='booking-link-div'>
                <Result
                    status="404"
                    title="The event does not exist any more"
                    subTitle="It is possible this event is cancelled"
                />
            </div>
        </div>
    }

    const name = decodeURIComponent(window.location.search.substring(6));

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
            <div className='booking-actions'>
                <Result
                    icon={<ClockCircleFilled />}
                    title={`${booking.bookingLink.ownerName} and ${booking.invitees[0].firstName} ${booking.invitees[0].lastName}`}
                    extra={
                        <Button type="primary" key="cancel"
                            onClick={() => {
                                    // call cancel api
                                    cancelBooking(booking.id, name, () => {
                                        setTimeout(() => {
                                            window.location.href = `${window.location.protocol}//${window.location.host}/public/bookingLinks/${booking!.bookingLink.id}`;
                                        }, 1500);
                                    });
                                    message.success('This event has been cancelled. We are forwarding you to the page where you can reschedule.');
                                }
                            }>
                            Cancel / Reschedule
                        </Button>
                    }
                />
            </div>
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({
    booking: state.bookingReducer.booking
});

export default connect(mapStateToProps, {
    getBooking,
    cancelBooking
})(BookingPublicPage);