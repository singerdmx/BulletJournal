import React, {useEffect} from 'react';
import './points.styles.less';
import {BackTop, Empty, Tabs} from "antd";
import {IState} from '../../store';
import {connect} from 'react-redux';

const {TabPane} = Tabs;

type PointsProps = {
    userPoint: number
};

const PointsPage: React.FC<PointsProps> = (props) => {

    const {userPoint} = props;

    useEffect(() => {
        document.title = 'Bullet Journal - Points';
    }, []);

    return (
        <div className='points-page'>
            <BackTop/>
            <Tabs defaultActiveKey="1">
                <TabPane tab="Activities" key="1">
                    <div style={{textAlign: "right", padding: "2rem"}}>Total Points: {userPoint}</div>
                    <Empty/>
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
});

export default connect(mapStateToProps)(PointsPage);
