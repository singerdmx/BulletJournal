import React from "react";
import {useParams} from "react-router-dom";

type BookingLinkPublicProps = {
}

const BookingLinkPublicPage: React.FC<BookingLinkPublicProps> = (props) => {
    const {bookingLinkId} = useParams();
    return <div>
        {bookingLinkId}
    </div>
}

export default BookingLinkPublicPage;