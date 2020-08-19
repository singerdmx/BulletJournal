import React, {useEffect} from 'react';
import { ScheduleOutlined } from '@ant-design/icons';
import './statistics.styles.less';
import {BackTop} from "antd";

type ProjectStatisticsProps = {
};

const ProjectStatisticsPage: React.FC<ProjectStatisticsProps> = (props) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Punch Card';
    }, []);

    return (
    <div className='project-statistics-page'>
        <BackTop />

        <ScheduleOutlined />
    </div>
  );
};


export default ProjectStatisticsPage;
