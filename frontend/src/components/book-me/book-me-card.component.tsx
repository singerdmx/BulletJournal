import React from 'react';
import {IState} from "../../store";
import {connect} from "react-redux";
import {ClockCircleOutlined, DashboardOutlined, FieldTimeOutlined} from "@ant-design/icons";

type BookMeCardProps = {
    span: number,
    backgroundColor: string,
    img: string
}

const BookMeCard: React.FC<BookMeCardProps> = (props) => {
    const {span, backgroundColor, img} = props;

    const getIcon = (span: number) => {
        if (span == 15) {
            return <ClockCircleOutlined/>;
        } else if (span == 30) {
            return <DashboardOutlined/>;
        } else if (span == 60) {
            return <FieldTimeOutlined/>;
        }
    }

    const getSpan = (span: number) => {
        if (span != 60) {
            return span + " mins"
        } else {
            return "1 hr"
        }
    }

    return <div className="book-me-card" style={{backgroundColor: backgroundColor}}>
        <div className="book-me-card-title">
            <h1> {getIcon(span)} {span} Minute Booking</h1>
            <span>{getSpan(span)}, One-on-One</span>
            <div>
                <img sizes="50px"
                     alt="pointer"
                     src={img}/>
            </div>
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(BookMeCard);
