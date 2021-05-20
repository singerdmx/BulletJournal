import React, {useEffect, useState} from 'react';
import {IState} from "../../store";
import {connect} from "react-redux";
import {HistoryOutlined} from "@ant-design/icons";
import {Select} from 'antd';

const {Option} = Select;

type CustomDurationCardProps = {
    backgroundColor: string,
    img: string,
    imgHeight: string,
    imgWidth: string,
    setCardIsClicked: (visible: boolean) => void,
    setDisableCreateNewProjectOrBooking: (disable: boolean) => void,
    setCurrentSlotSpan: (span: number) => void,
}

const getHours = () => {
    const ans = [];
    for (let i = 0; i <= 24; i++) {
        ans.push(i);
    }
    return ans;
}

const hours = getHours();

const hourOptions = hours.map(hour => <Option value={(hour).toString()} key={(hour).toString()}>{hour}</Option>);
const mins = [0, 15, 30, 45];
const minOptions = mins.map(min => <Option value={(min).toString()} key={(min).toString()}>{min}</Option>);

const CustomDurationCard: React.FC<CustomDurationCardProps> = (props) => {
    const {backgroundColor, img, imgHeight, imgWidth, setCardIsClicked, setDisableCreateNewProjectOrBooking, setCurrentSlotSpan} = props;
    const [hr, setHr] = useState("0");
    const [min, setMin] = useState("45");
    const [error, setError] = useState();

    const invalidInput = () => {
        return (hr === "0" && min === "0");
    }

    useEffect(() => {
        if (invalidInput()) {
            setError("Duration cannot be 0");
            setDisableCreateNewProjectOrBooking(true);
        }else {
            setError("");
            setDisableCreateNewProjectOrBooking(false);
        }
    }, [hr, min])


    const handleBookMeCardClick = () => {
        setCardIsClicked(true);
        const span : number = Number(min) + Number(hr) * 60;
        setCurrentSlotSpan(span);
    }

    return <div className="book-me-card" style={{backgroundColor: backgroundColor}}
                onClick={handleBookMeCardClick}>
        <div className="book-me-card-title">
            <h1><HistoryOutlined/> Custom Duration</h1>
            <div style={{color: "red", marginBottom:"1px"}}>{error}</div>
            <span>
                <Select defaultValue="0" style={{width: 60}}
                        onChange={(value: string) => setHr(value)}
                        onClick={(e) =>  e.stopPropagation()}
                >
                    {hourOptions}
                </Select>
                {' '}hr{' '}
                <Select defaultValue="45" style={{width: 60}}
                        onChange={(value: string) => setMin(value)}
                        onClick={(e) =>  e.stopPropagation()}
                >
                    {minOptions}
                </Select>
                {' '}min{' '}
            </span>
            <div>
                <img height={imgHeight}
                     width={imgWidth}
                     alt="pointer"
                     src={img}/>
            </div>
        </div>
    </div>
}

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(CustomDurationCard);
