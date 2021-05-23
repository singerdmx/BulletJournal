import React, {useEffect, useState} from "react";
import {Empty, Input, Tooltip} from "antd";
import {CheckCircleOutlined, CloseCircleOutlined, QuestionCircleOutlined} from "@ant-design/icons";

import './book-me.styles.less';
import {IState} from "../../store";
import {connect} from "react-redux";
import {getBookingLinks, getBookMeUsername, updateBookMeUsername} from "../../features/bookingLink/actions";
import {BookingLink} from "../../features/bookingLink/interface";

type ManageBookingProps = {
    myself: string;
    bookMeUsername: string;
    links: BookingLink[];
    getBookMeUsername: () => void;
    updateBookMeUsername: (name: string) => void;
    getBookingLinks: () => void;
}

const ManageBooking: React.FC<ManageBookingProps> = (
    {
        myself,
        bookMeUsername,
        links,
        getBookMeUsername,
        updateBookMeUsername,
        getBookingLinks
    }
) => {
    const [name, setName] = useState(bookMeUsername ? bookMeUsername : myself);
    const [nameChanged, setNameChanged] = useState(false);

    useEffect(() => {
        if (!bookMeUsername) {
            // make GET request to retrieve
            getBookMeUsername();
        } else {
            setName(bookMeUsername);
        }
    }, [bookMeUsername]);

    useEffect(() => {
        getBookingLinks();
    }, []);

    const handleOnClick = (save: boolean) => {
        if (save) {
            // make PUT request to update bookMeUsername
            updateBookMeUsername(name);
        } else {
            setName(bookMeUsername);
        }
        setNameChanged(false);
    }

    return <div>
        <div className='book-me-name'>
            Name&nbsp;&nbsp;
            <Tooltip
                title="This is your name as it appears on your booking page and in email notifications.">
                                    <span className="question-icon">
                                    <QuestionCircleOutlined/>
                                </span>
            </Tooltip>
            <Input className='book-me-name-input' value={name} onChange={(e) => {
                setNameChanged(true);
                setName(e.target.value);
            }}/>
            <Tooltip placement="top" title='Save'>
                <CheckCircleOutlined
                    onClick={() => handleOnClick(true)}
                    style={{
                        marginLeft: '20px',
                        cursor: 'pointer',
                        color: '#00e600',
                        fontSize: 20,
                        visibility: nameChanged ? 'visible' : 'hidden'
                    }} />
            </Tooltip>
            <Tooltip placement="top" title='Cancel'>
                <CloseCircleOutlined
                    onClick={() => handleOnClick(false)}
                    style={{
                        marginLeft: '20px',
                        cursor: 'pointer',
                        color: '#ff0000',
                        fontSize: 20,
                        visibility: nameChanged ? 'visible' : 'hidden'
                    }} />
            </Tooltip>
        </div>
        {links.map(l => {
            return <div>{l.slotSpan} {l.timezone}</div>
        })}
    </div>
}

const mapStateToProps = (state: IState) => ({
    myself: state.myself.username,
    bookMeUsername: state.bookingReducer.bookMeUsername,
    links: state.bookingReducer.links
});

export default connect(mapStateToProps, {
    getBookMeUsername,
    updateBookMeUsername,
    getBookingLinks
})(ManageBooking);