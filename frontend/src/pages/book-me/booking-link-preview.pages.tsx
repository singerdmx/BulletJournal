import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

import './booking-link-preview.styles.less';
import {Avatar, BackTop, Tooltip} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getBookingLink} from "../../features/bookingLink/actions";
import {BookingLink} from "../../features/bookingLink/interface";
import {ClockCircleOutlined} from "@ant-design/icons";
import {getSlotSpan} from "../../components/book-me/book-me-drawer";
import BookMeCalendar from "../../components/book-me/book-me-calendar.component";

type BookingLinkPreviewProps = {
    link: undefined | BookingLink;
    getBookingLink: (bookingLinkId: string, timezone?: string) => void;
}

const BookingLinkPreviewPage: React.FC<BookingLinkPreviewProps> = (
    {
        link,
            getBookingLink
    }) => {
    const {bookingLinkId} = useParams();

    useEffect(() => {
        bookingLinkId && getBookingLink(bookingLinkId);
    }, [bookingLinkId]);

    if (!link) {
        return <div></div>
    }
    return <div className='booking-link-div'>
        <BackTop/>
        <Tooltip
            placement="top"
            title={link.ownerName}
            className="link-avatar"
        >
          <span>
            <Avatar size="large" src={link.owner.avatar}/>
          </span>
        </Tooltip>
        <h1 className="book-me-drawer-header">
            <ClockCircleOutlined/> {getSlotSpan(link.slotSpan)} Booking
        </h1>
        <BookMeCalendar/>
    </div>
}

const mapStateToProps = (state: IState) => ({
    link: state.bookingReducer.link
});

export default connect(mapStateToProps, {
    getBookingLink
})(BookingLinkPreviewPage);