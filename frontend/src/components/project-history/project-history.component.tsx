// note item component for note tree
// react import
import React from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
// antd imports
import {
  DeleteTwoTone,
  MoreOutlined,
  FileTextOutlined,
  FormOutlined,
} from '@ant-design/icons';
import { Avatar, Popconfirm, Popover, Tag, Tooltip, Empty } from 'antd';
import { getIcon } from '../modals/show-project-history.component';
// assets import
import { IState } from '../../store';
import { Activity } from '../../features/project/interface';
import moment from 'moment';

type ProjectHistoryProps = {
  activities: Activity[];
};

const ProjectHistory: React.FC<ProjectHistoryProps> = (props) => {
  const { activities } = props;

  function parseActivity(activity: string): JSX.Element {
    return (
      <span>
        {activity.split('##').map((a, index) => {
          if (index % 2 === 1) {
            return <strong key={index}>{a}</strong>;
          }
          return a;
        })}
      </span>
    );
  }

  if (activities && activities.length > 0) {
    return (
      <div>
        {activities.map((a: Activity, index) => {
          let meta = (
            <div key={index} onClick={() => console.log(a.link)}>
              <div>
                <Tooltip title={a.originator.alias}>
                  <Avatar src={a.originator.thumbnail} />
                </Tooltip>
                {getIcon(a.action)}
                &nbsp;&nbsp;
                {parseActivity(a.activity)}&nbsp;&nbsp;
                {moment(a.activityTime).fromNow()}
              </div>
            </div>
          );

          if (a.link)
            meta = (
              <Link color='black' to={a.link}>
                {meta}
              </Link>
            );

          return meta;
        })}
      </div>
    );
  }

  return <Empty />;
};

const mapStateToProps = (state: IState) => ({});

export default connect(mapStateToProps, {})(ProjectHistory);
