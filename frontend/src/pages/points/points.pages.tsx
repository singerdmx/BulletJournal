import React, {useEffect} from 'react';
import './points.styles.less';
import {BackTop, Button, Empty, Tabs} from "antd";
import {IState} from '../../store';
import {connect} from 'react-redux';
import {UserPointActivity} from "./interface";
import Card from "antd/es/card";
import {getUserPointActivities} from "../../features/myself/actions";

const {TabPane} = Tabs;

type PointsProps = {
    userPoint: number
    userPointActivities: UserPointActivity[];
    getUserPointActivities:() => void;
};

const PointsPage: React.FC<PointsProps> = (props) => {

    const {userPoint, userPointActivities} = props;

    useEffect(() => {
        document.title = 'Bullet Journal - Points';
    }, []);

    return (
        <div className='points-page'>
            <BackTop/>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Activities" key="1">
                    <div style={{textAlign: "right", padding: "2rem"}}>Total Points: {userPoint}</div>

                    <Button
                        className='button'
                        type='primary'
                        onClick={() => {
                            getUserPointActivities()
                        }}
                    >
                        Get History
                    </Button>
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
