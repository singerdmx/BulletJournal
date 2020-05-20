// note item component for note tree
// react import
import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
// antd imports
import {
  LinkOutlined,
} from '@ant-design/icons';
import { Avatar, Table, Tooltip, Empty } from 'antd';
import { getIcon } from '../modals/show-project-history.component';
// assets import
import { IState } from '../../store';
import { Activity } from '../../features/project/interface';
import moment from 'moment';
import {User} from "../../features/group/interface";
import {ContentAction} from "../../features/project/constants";

type ProjectHistoryProps = {
  activities: Activity[];
};

const ProjectHistory: React.FC<ProjectHistoryProps> = (props) => {
  const { activities } = props;
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
        <Avatar src={u.avatar} />
      </Tooltip>

    },
    {
      title: 'Activity',
      dataIndex: 'activity',
      key: 'activity',
      render: (a: string) => parseActivity(a)
    },
    {
      title: 'Time',
      dataIndex: 'activityTime',
      key: 'activityTime',
      render: (a: string) => moment(a).fromNow()
    },
    {
      title: '',
      dataIndex: 'link',
      key: 'link',
      render: (l: string) => l ? <Link to={l}>
          <LinkOutlined /> </Link>: null
    },
  ];
  function parseActivity(activity: string): JSX.Element {
    const res = (
      <span>
        {activity.split('##').map((a, index) => {
          if (index % 2 === 1) {
            return <strong key={index}>{a}</strong>;
          }
          return a;
        })}
      </span>
    );
    return res;
  }

  if (!activities || activities.length === 0) {
    return <Empty />;
  }

  return (
      <div>
        <Table columns={columns} dataSource={activities} />
      </div>
  );
};

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(ProjectHistory);
