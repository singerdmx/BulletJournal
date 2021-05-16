import React from 'react';
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
}

const getHours = () => {
    const ans = [];
    for(let i=0; i <= 24; i++) {
        ans.push(i);
    }
    return ans;
}

const hours = getHours();

const hourOptions = hours.map(hour => <Option value={(hour).toString()}>{hour}</Option>);
const mins = [0,15,30,45];
const minOptions = mins.map(min => <Option value={(min).toString()}>{min}</Option>);

const CustomDurationCard: React.FC<CustomDurationCardProps> = (props) => {
    const {backgroundColor, img, imgHeight, imgWidth} = props;

    return <div className="book-me-card" style={{backgroundColor: backgroundColor}}>
        <div className="book-me-card-title">
            <h1><HistoryOutlined/> Custom Duration</h1>
            <span>
                <Select defaultValue="0" style={{width: 58,marginRight: 2}}>
                    {hourOptions}
                </Select>
                hr
                <Select defaultValue="45" style={{width: 58,marginRight: 2, marginLeft: 2}}>
                    {minOptions}
                </Select>
                min
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
