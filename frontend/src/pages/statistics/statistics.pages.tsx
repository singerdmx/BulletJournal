import React, {useEffect} from 'react';
import { ScheduleOutlined } from '@ant-design/icons';
import './statistics.styles.less';
import {BackTop, Empty} from "antd";
import { IState } from '../../store';
import {connect} from 'react-redux';
import {getTaskStatistics} from '../../features/tasks/actions';
import { TaskStatistics } from '../../features/tasks/interface';
import { Project } from '../../features/project/interface';

type ProjectStatisticsProps = {
    projectStatistics: TaskStatistics | undefined;
    timezone: string;
    project: Project | undefined;
    getTaskStatistics: (
        projectIds: number[],
        timezone: string,
        startDate: string,
        endDate: string
    ) => void;
};

const ProjectStatisticsPage: React.FC<ProjectStatisticsProps> = ({
    projectStatistics, 
    timezone,
    project,
    getTaskStatistics
}) => {
    useEffect(() => {
        document.title = 'Bullet Journal - Statistics';
        if (project) {
            getTaskStatistics([project.id], timezone, "", "");
        }
    }, [project]);
    if (!projectStatistics) {
        return <Empty />;
    }
    return (
    <div className='project-statistics-page'>
        <BackTop />
            <div>{projectStatistics.completed}</div>
            <div>{projectStatistics.uncompleted}</div>
            <div>{projectStatistics.userTaskStatistics.map(t => {
                return <div>{t.user.avatar}</div>
            })}</div>
            
        <ScheduleOutlined />
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
    projectStatistics: state.task.projectStatistics,
    timezone: state.settings.timezone,
    project: state.project.project
});

export default connect(mapStateToProps, {getTaskStatistics})(ProjectStatisticsPage);
