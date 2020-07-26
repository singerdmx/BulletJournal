import React, { useEffect, useState } from 'react';
import { DollarCircleOutlined } from '@ant-design/icons';
import './points.styles.less';
import { BackTop } from "antd";
import { Tabs } from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';


const { TabPane } = Tabs;

type PointsProps = {
    userPoint: number
};

const PointsPage: React.FC<PointsProps> = (props) => {

    const { userPoint } = props;

    const [PointList, setPointList] = useState([
        {
            date: "monday",
            point: "+1",
            desc: "Completed a daily check-in mission",
        },
        {
            date: "tuesday",
            point: "+2",
            desc: "Completed a page",
        },
        {
            date: "wednesday",
            point: "+3",
            desc: "Completed a day",
        },
        {
            date: "thursday",
            point: "+4",
            desc: "Completed a task",
        },
    ]);

    useEffect(() => {
        document.title = 'Bullet Journal - Points';
    }, []);

    const pointActivity = PointList.map((point) => (
        <li className="points-list-item" style={{ listStyle: "none" }}>
            <div className="points-date"> {point.date}</div>
            <table className="points-list-item-table" style={{ width: "100%" }}>
                <tbody>
                    <tr>
                        <th className="points-head" style={{ width: '30%' }}>
                            <DollarCircleOutlined style={{ fontSize: "4rem", color: "#FFD700" }} />
                            <div>{point.point}</div>
                        </th>
                        <th className="points-body"
                        ><div className="title">Mission</div>
                            <div className="description"><span>{point.desc}</span></div>
                        </th>
                    </tr>
                </tbody>
            </table>
        </li>

    ));

    return (
        <div className='points-page'>
            <BackTop />
            <Tabs defaultActiveKey="1">
                <TabPane tab="Points" key="1">
                    <div style={{ textAlign: "right", padding: "2rem" }}>Total Points:{userPoint}</div>
                    <div style={{ textAlign: "center" }}><h1>Points Activity</h1></div>

                    <div className="points-container" style={{ display: "flex", justifyContent: 'center' }}>

                        <ul className="points-list" style={{ textAlign: "center" }}>
                            {pointActivity}
                        </ul>
                    </div>
                </TabPane>
                <TabPane tab="Redeem" key="2">
                    Redeem your Points
                </TabPane>
            </Tabs>


        </div>
    );
};


const mapStateToProps = (state: IState) => ({
    userPoint: state.myself.points,
});

export default connect(mapStateToProps)(PointsPage);
