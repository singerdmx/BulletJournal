import React from "react";
import {useParams} from "react-router-dom";
import {BackTop} from "antd";

import './booking-link.pages.styles.less';

type BookingLinkPublicProps = {
}

const BookingLinkPublicPage: React.FC<BookingLinkPublicProps> = (props) => {
    const {bookingLinkId} = useParams();
    return <div className='booking-link-div'>
        <BackTop/>
        <div>
            {bookingLinkId}
        </div>
    </div>
}

export default BookingLinkPublicPage;