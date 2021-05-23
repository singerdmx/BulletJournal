import React from "react";
import {useParams} from "react-router-dom";

type BookingLinkPreviewProps = {
}

const BookingLinkPreviewPage: React.FC<BookingLinkPreviewProps> = (props) => {
    const {bookingLinkId} = useParams();
    return <div>
        {bookingLinkId}
    </div>
}

export default BookingLinkPreviewPage;