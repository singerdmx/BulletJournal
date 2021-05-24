import React, {useEffect} from "react";
import {useParams} from "react-router-dom";

import './booking-link-preview.styles.less';
import {BackTop} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getBookingLink} from "../../features/bookingLink/actions";
import {BookingLink} from "../../features/bookingLink/interface";

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
        <div>
            {bookingLinkId}
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({
    link: state.bookingReducer.link
});

export default connect(mapStateToProps, {
    getBookingLink
})(BookingLinkPreviewPage);