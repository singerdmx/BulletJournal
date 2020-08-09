import React, {useEffect} from 'react';
import './points.styles.less';
import {BackTop, Empty, Tabs, Table} from "antd";
import { GiftOutlined, FlagOutlined } from '@ant-design/icons';
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

    const columns = [
        {
            title: 'Description',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Point',
            dataIndex: 'pointChange',
            key: 'pointChange',
        },
        {
            title: 'Time',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (text: number) => (
                 moment(text).fromNow()

            ),
        },
    ];

    return (
        <div className='points-page'>
            <BackTop/>
            <Tabs defaultActiveKey="1">
                <TabPane tab={<span><FlagOutlined />Activities</span>} key="1">
                    <div style={{textAlign: "left", padding: "2rem"}}>Total Points: {userPoint}</div>
                    <div>
                        {
                            userPointActivities.length === 0 ? <Empty/> : <div>
                                <Table dataSource={userPointActivities} columns={columns} />
                            </div>
                        }
                    </div>
                </TabPane>
                <TabPane tab={<span><GiftOutlined />Redeem</span>} key="2">
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
