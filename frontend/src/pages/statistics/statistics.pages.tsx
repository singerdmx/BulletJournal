import React, {useEffect, useState} from 'react';
import './statistics.styles.less';
import {Alert, Avatar, BackTop, Empty, Popover, Progress, Tooltip, Select, DatePicker, Space, Input} from "antd";
import {IState} from '../../store';
import {connect} from 'react-redux';
import {TaskStatistics, UserTaskStatistic} from '../../features/tasks/interface';
import {Project, ProjectsWithOwner} from '../../features/project/interface';
import {getTasksByAssignee, getTaskStatistics} from '../../features/tasks/actions';
import {getProject} from "../../features/project/actions";
import {useHistory, useParams} from "react-router-dom";
import {User} from "../../features/group/interface";
import TasksByAssignee from "../../components/modals/tasks-by-assignee.component";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {SyncOutlined, UpSquareOutlined, SearchOutlined} from "@ant-design/icons/lib";
import { flattenOwnedProject, flattenSharedProject } from '../projects/projects.pages';
import { ProjectType } from '../../features/project/constants';
import { iconMapper } from '../../components/project-dnd/project-dnd.component';
import { onFilterUser } from '../../utils/Util';

type ProjectStatisticsProps = {
    projectStatistics: TaskStatistics | undefined;
    timezone: string;
    project: Project | undefined;
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
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
        ownedProjects,
        sharedProjects,
        getTaskStatistics,
        getProject,
        getTasksByAssignee
    }) => {
    const {projectId} = useParams();
    const history = useHistory();
    const [initialized, setInitialized] = useState(false);
    const [tasksByUsersShown, setTasksByUsersShown] = useState(false);
    const [assignee, setAssignee] = useState<User | undefined>(undefined);
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectIds, setProjectIds] = useState<number[] | undefined>(project ? [project.id] : undefined);
    const [startTime, setStartTime] = useState<string>('');
    const [endTime, setEndTime] = useState<string>('');
    const [filter, setFilter] = useState<string>('');
    const [filteredUserStatistics, setfilteredUserStatistics] = useState<UserTaskStatistic[] | undefined>(projectStatistics?.userTaskStatistics);

    useEffect(() => {
        let allProjects = [] as Project[];
        allProjects = flattenOwnedProject(ownedProjects, allProjects);
        allProjects = flattenSharedProject(sharedProjects, allProjects);
        allProjects = allProjects.filter((p) => {
            if (!project) {
                return true;
            }
            return (
                p.projectType === ProjectType.TODO && !p.shared
            );
        });
        setProjects(allProjects);
    }, [ownedProjects, sharedProjects]);


    const fetchTaskStatistics = () => {
        if (projectIds === undefined) {
            return;
        }
        getTaskStatistics(projectIds, timezone, startTime, endTime);
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
            setProjectIds([project.id]);
        }
    }, [project]);

    useEffect(() => {
        fetchTaskStatistics();
    }, [projectIds, timezone, startTime, endTime]);

    useEffect(() => {
        if (!projectStatistics?.userTaskStatistics) {
            return;
        }
        const userStatistics = projectStatistics.userTaskStatistics.filter(u => onFilterUser(u.user, filter))
        setfilteredUserStatistics(userStatistics);
    }, [projectStatistics, filter])

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

    if (!projectStatistics || !project || !filteredUserStatistics) {
        return <div className='project-statistics-page'>
            <Empty/>
        </div>;
    }

    const getPercentage = (data: any) => {
        if (data.completed + data.uncompleted === 0) {
            return 0;
        }
        return Math.round(data.completed * 100 / (data.completed + data.uncompleted));
    }

    const { Option } = Select;
    
    function handleChange(value: any) {
        if (value.length === 0) return;
        setProjectIds(value);
    }

    function handleStartTimeChange(time: any, timeString: string) {
        if (time) {
            setStartTime(timeString);
        }
        else {
            setStartTime('');
        }
    }

    function handleEndTimeChange(time: any, timeString: string) {
        if (time) {
            setEndTime(timeString);
        }
        else {
            setEndTime('');
        }
    }

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        let { value } = e.target;
        value = value.toLowerCase();
        if (value) {
            setFilter(value);
        }
        else {
            setFilter('');
        }
    };

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
                <div>
                    <Space direction="vertical" >
                        <Tooltip title='Start Date'>
                            <DatePicker 
                                showTime 
                                allowClear 
                                onChange={handleStartTimeChange} 
                                format="YYYY-MM-DD" 
                                placeholder='Start Date'/>
                        </Tooltip>
                        <Tooltip title='End Date'>
                            <DatePicker 
                                showTime 
                                allowClear 
                                onChange={handleEndTimeChange} 
                                format="YYYY-MM-DD"
                                placeholder='End Date'/>
                        </Tooltip>
                    </Space>
                </div>
                <div>
                    <Tooltip title='Select BuJo'>
                        <Select
                        mode="multiple"
                        style={{ minWidth: '100px', maxWidth: '200px' }}
                        placeholder='Select BuJo'
                        defaultValue={project.id}
                        onChange={handleChange}
                        >
                            {projects.map((project) => {
                                return (    
                                    <Option value={project.id} key={project.id}>
                                    <Tooltip
                                        title={`${project.name} (Owner ${project.owner.alias}) (Group ${project.group.name})`}
                                        placement='left'
                                    >
                                        <span>
                                        <Avatar size='small' src={project.owner.avatar} />
                                        &nbsp; {iconMapper[project.projectType]}
                                        &nbsp; <strong>{project.name}</strong>
                                        &nbsp; (Group <strong>{project.group.name}</strong>)
                                        </span>
                                    </Tooltip>
                                    </Option>
                                );
                            })}
                        </Select>
                    </Tooltip>
                </div>
                <div>
                    <Input style={{maxWidth: 130}} value={filter} placeholder="Filter User" allowClear={true} prefix={<SearchOutlined />} onChange={e => onFilter(e)} />
                </div>
            </div>
            
            
            <div className='user-progress-bars'>
                {filteredUserStatistics.map(t => {
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
                        onClick={() => {
                            setProjectIds([project.id]);
                            fetchTaskStatistics();
                            return;
                        }}
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
    project: state.project.project,
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared
});

export default connect(mapStateToProps, {
    getTaskStatistics,
    getProject,
    getTasksByAssignee, 
    flattenOwnedProject,
    flattenSharedProject
})(ProjectStatisticsPage);
