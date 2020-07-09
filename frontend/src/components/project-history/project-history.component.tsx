// note item component for note tree
// react import
import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
// antd imports
import {Avatar, Empty, Table, Tooltip} from 'antd';
import {getIcon} from '../modals/show-project-history.component';
// assets import
import {IState} from '../../store';
import {Activity} from '../../features/project/interface';
import moment from 'moment';
import {User} from "../../features/group/interface";
import {ContentAction} from "../../features/project/constants";

type ProjectHistoryProps = {
    activities: Activity[];
};

const ProjectHistory: React.FC<ProjectHistoryProps> = (props) => {
    const {activities} = props;
    const columns = [
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (a: ContentAction) => <Tooltip placement='left' title={a.toString().replace(/_/g, " ")}>
                {getIcon(a.toString())}
            </Tooltip>
        },
        {
            title: 'User',
            dataIndex: 'originator',
            key: 'originator',
            render: (u: User) => <Tooltip title={u.alias}>
                <Avatar src={u.avatar}/>
            </Tooltip>

        },
        {
            title: 'Activity',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Time',
            dataIndex: 'activityTime',
            key: 'activityTime',
            render: (a: string) => <Tooltip title={moment(a).fromNow()}><span>{moment(a).format('YYYY-MM-DD HH:mm')}</span></Tooltip>
        },
    ];

    function parseActivity(a: Activity) {
        const res: any = {...a};
        let description = (
            <span>
        {a.activity.split('##').map((a, index) => {
            if (index % 2 === 1) {
                return <strong key={index}>{a}</strong>;
            }
            return a;
        })}
      </span>
        );
        if (a.link) {
            description = <Link to={a.link}> {description} </Link>
        }
        res['description'] = description;
        return res;
    }

    if (!activities || activities.length === 0) {
        return <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description='No Data. Try the Refresh Button Above.'/>;
    }

    return (
        <div>
            <Table columns={columns} dataSource={activities.map(a => parseActivity(a))}/>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(ProjectHistory);
