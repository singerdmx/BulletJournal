import React, {useEffect} from "react";
import {useParams} from "react-router-dom";
import {Avatar, BackTop, Tooltip} from "antd";

import './booking-link.pages.styles.less';
import {IState} from "./store";
import {connect} from "react-redux";
import {getBookingLink} from "./features/bookingLink/actions";
import {BookingLink} from "./features/bookingLink/interface";
import {getRandomBackgroundImage} from "./assets/background";
import {ClockCircleOutlined, SwapRightOutlined} from "@ant-design/icons";
import {getSlotSpan} from "./components/book-me/book-me-drawer";
import BookMeCalendar from "./components/book-me/book-me-calendar.component";

type BookingLinkPublicProps = {
    link: undefined | BookingLink;
    getBookingLink: (bookingLinkId: string, timezone?: string) => void;
}

const BookingLinkPublicPage: React.FC<BookingLinkPublicProps> = (
    {
        link,
        getBookingLink
    }) => {
    const {bookingLinkId} = useParams();
    const fullHeight = global.window.innerHeight;

    useEffect(() => {
        bookingLinkId && getBookingLink(bookingLinkId, Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, [bookingLinkId]);

    if (!link) {
        return <div></div>
    }
    return <div style={{backgroundImage: `url(${getRandomBackgroundImage()})`, height: `${fullHeight}px`}}
                className='public-container'>
            <div className='booking-link-div'>
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
                <ClockCircleOutlined/> {getSlotSpan(link.slotSpan)} Booking&nbsp;&nbsp;{link.startDate} <SwapRightOutlined /> {link.endDate}
            </h1>
            <BookMeCalendar/>
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({
    link: state.bookingReducer.link
});

export default connect(mapStateToProps, {
    getBookingLink
})(BookingLinkPublicPage);