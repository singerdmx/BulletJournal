import React, {useEffect} from 'react';
import './points.styles.less';
import {BackTop, Empty, Tabs, Card} from "antd";
import {IState} from '../../store';
import {connect} from 'react-redux';
import {UserPointActivity} from "./interface";
import {getUserPointActivities} from "../../features/myself/actions";
import moment from "moment";

const {TabPane} = Tabs;

type PointsProps = {
    userPoint: number
    userPointActivities: UserPointActivity[];
    getUserPointActivities: () => void;
};

const PointsPage: React.FC<PointsProps> = (props) => {

    const {userPoint, userPointActivities, getUserPointActivities} = props;

    useEffect(() => {
        document.title = 'Bullet Journal - Points';
        console.log('getUserPointActivities')
        getUserPointActivities();
    }, []);

    return (
        <div className='points-page'>
            <BackTop/>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Activities" key="1">
                    <div style={{textAlign: "right", padding: "2rem"}}>Total Points: {userPoint}</div>
                    <div>
                        {
                            userPointActivities.length === 0 ? <Empty/> : <div>
                                {userPointActivities.map(a => {
                                    return <Card>{a.username} {a.description} {moment(a.createdAt).fromNow()}</Card>
                                })}
                            </div>
                        }
                    </div>
                </TabPane>
                <TabPane tab="Redeem" key="2">
                    <Empty/>
                </TabPane>
            </Tabs>
        </div>
    );
};


const mapStateToProps = (state: IState) => ({
    userPoint: state.myself.points,
    userPointActivities: state.myself.userPointActivities
});

export default connect(mapStateToProps,{getUserPointActivities})(PointsPage);
