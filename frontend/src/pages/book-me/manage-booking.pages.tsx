import React from "react";
import {Empty, Input, Tooltip} from "antd";
import {QuestionCircleOutlined} from "@ant-design/icons";

import './book-me.styles.less';
import {IState} from "../../store";
import {connect} from "react-redux";

type ManageBookingProps = {
    myself: string;
    bookMeUsername: string;
}

const ManageBooking: React.FC<ManageBookingProps> = (
    {
        myself,
        bookMeUsername
    }
) => {
    return <div>
        <div className='book-me-name'>
            Name&nbsp;&nbsp;
            <Tooltip
                title="This is your name as it appears on your booking page and in email notifications.">
                                    <span className="question-icon">
                                    <QuestionCircleOutlined/>
                                </span>
            </Tooltip>
            <Input className='book-me-name-input' value={bookMeUsername ? bookMeUsername : myself}/>
        </div>
        <Empty/>
    </div>
}

const mapStateToProps = (state: IState) => ({
    myself: state.myself.username,
    bookMeUsername: state.bookingReducer.bookMeUsername
});

export default connect(mapStateToProps, {
})(ManageBooking);