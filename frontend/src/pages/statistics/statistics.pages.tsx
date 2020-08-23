import React, {useEffect, useState} from 'react';
import './statistics.styles.less';
import {Alert, Avatar, BackTop, Empty, Popover, Progress} from "antd";
import {IState} from '../../store';
import {connect} from 'react-redux';
import {TaskStatistics} from '../../features/tasks/interface';
import {Project} from '../../features/project/interface';
import {getTasksByAssignee, getTaskStatistics} from '../../features/tasks/actions';
import {getProject} from "../../features/project/actions";
import {useHistory, useParams} from "react-router-dom";
import {User} from "../../features/group/interface";
import TasksByAssignee from "../../components/modals/tasks-by-assignee.component";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {SyncOutlined, UpSquareOutlined} from "@ant-design/icons/lib";

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
    getTasksByAssignee: (projectId: number, assignee: string) => void;
    getProject: (projectId: number) => void;
};

const ProjectStatisticsPage: React.FC<ProjectStatisticsProps> = (
    {
        projectStatistics,
        timezone,
        project,
        getTaskStatistics,
        getProject,
        getTasksByAssignee
    }) => {
    const {projectId} = useParams();
    const history = useHistory();
    const [initialized, setInitialized] = useState(false);
    const [projectLoaded, setProjectLoaded] = useState(false);
    const [tasksByUsersShown, setTasksByUsersShown] = useState(false);
    const [assignee, setAssignee] = useState<User | undefined>(undefined);

    const fetchTaskStatistics = (project: Project) => {
        getTaskStatistics([project.id], timezone, "", "")
    }

    useEffect(() => {
        document.title = 'Bullet Journal - Statistics';
        if (!projectId) {
            return;
        }
        if (!project) {
            getProject(parseInt(projectId));
            return;
        }
        if (project && !initialized) {
            setInitialized(true);
            fetchTaskStatistics(project);
        }
    }, [project]);

    //by user modal
    const handleGetTasksByAssignee = (u: User) => {
        if (!projectId) {
            return;
        }
        setTasksByUsersShown(true);
        setAssignee(u);
        // update tasks
        getTasksByAssignee(parseInt(projectId), u.name);
    };

    if (!projectStatistics || !project) {
        return <div className='project-statistics-page'>
            <Empty/>
        </div>;
    }

    const getPercentage = (data: any) => {
        return Math.round(data.completed * 100 / (data.completed + data.uncompleted));
    }

    return (
        <div className='project-statistics-page'>
            <BackTop/>
            <div className='project-progress-bar'>
                <Popover
                    title='Total'
                    content={<>
                        <Alert message={`${projectStatistics.completed} completed`} type="success" showIcon/>
                        <Alert message={`${projectStatistics.uncompleted} uncompleted`} type="info" showIcon/>
                    </>}>
                    <div><Progress width={100} type="circle" percent={getPercentage(projectStatistics)}/></div>
                </Popover>
            </div>
            <div className='user-progress-bars'>
                {projectStatistics.userTaskStatistics.map(t => {
                    return <Popover
                        title={t.user.alias}
                        content={<>
                            <Alert message={`${t.completed} completed`} type="success" showIcon/>
                            <Alert message={`${t.uncompleted} uncompleted`} type="info" showIcon/>
                        </>}>
                        <div className="user-progress-bar" onClick={() => handleGetTasksByAssignee(t.user)}>
                            <div><Avatar src={t.user.avatar} size='large'/></div>
                            <Progress type="circle" size="small" percent={getPercentage(t)} width={60}/>
                        </div>
                    </Popover>
                })}
            </div>
            <div>
                <TasksByAssignee
                    assignee={assignee}
                    visible={tasksByUsersShown}
                    onCancel={() => setTasksByUsersShown(false)}
                    hideCompletedTask={() => {
                    }}
                />
            </div>
            <div>
                <Container>
                    <FloatButton
                        onClick={() => history.push(`/projects/${projectId}`)}
                        tooltip="Go to BuJo"
                        styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
                    >
                        <UpSquareOutlined/>
                    </FloatButton>
                    <FloatButton
                        onClick={() => fetchTaskStatistics(project)}
                        tooltip="Refresh"
                        styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
                    >
                        <SyncOutlined/>
                    </FloatButton>
                </Container>
            </div>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    projectStatistics: state.task.projectStatistics,
    timezone: state.settings.timezone,
    project: state.project.project
});

export default connect(mapStateToProps, {
    getTaskStatistics,
    getProject,
    getTasksByAssignee,
})(ProjectStatisticsPage);
