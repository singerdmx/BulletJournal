import React from "react";
import {useParams} from "react-router-dom";

import './booking-link-preview.styles.less';
import {BackTop} from "antd";

type BookingLinkPreviewProps = {
}

const BookingLinkPreviewPage: React.FC<BookingLinkPreviewProps> = (props) => {
    const {bookingLinkId} = useParams();
    return <div className='booking-link-div'>
        <BackTop/>
        <div>
            {bookingLinkId}
        </div>
    </div>
}

export default BookingLinkPreviewPage;