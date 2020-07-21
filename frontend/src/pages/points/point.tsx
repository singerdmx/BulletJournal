import React, { useState } from 'react';
import '../pages.style.less';
import coin from '../../assets/coin.jpeg';

export default function Point() {
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

    const [TotalPoint, setTotalPoint] = useState('0');


    return (
        <div>
            <div style={{ textAlign: "right", padding: "2rem" }}>Total Points:{TotalPoint}</div>
            <div style={{ textAlign: "center" }}><h1>Points Activity</h1></div>

            <div className="points-container" style={{ display: "flex", justifyContent: 'center' }}>

                <ul className="points-list" style={{ textAlign: "center" }}>
                    {
                        PointList.map((point) => (
                            <li className="points-list-item" style={{ listStyle: "none" }}>
                                <div className="points-date"> {point.date}</div>
                                <table className="points-list-item-table" style={{ width: "100%" }}>
                                    <tbody>
                                        <tr>
                                            <th className="points-head" style={{ width: '30%' }}>
                                                <img src={coin} alt="BulletPoint" style={{ width: "6rem", borderRadius: "50%" }} />
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

                        ))
                    }

                </ul>
            </div>
        </div>

    )
}
