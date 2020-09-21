import React, {useEffect, useState} from 'react';
import './steps.styles.less';
import {useHistory} from "react-router-dom";
import {IState} from "../../store";
import {connect} from "react-redux";
import {Avatar, Button, Result, Select, Tooltip} from "antd";
import {Project, ProjectsWithOwner} from "../../features/project/interface";
import {flattenOwnedProject, flattenSharedProject} from "../projects/projects.pages";
import {ProjectType} from "../../features/project/constants";
import AddProject from "../../components/modals/add-project.component";
import {iconMapper} from "../../components/side-menu/side-menu.component";
import {getCookie} from "../../index";

const {Option} = Select;

type StepsImportTasksProps = {
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
};

const StepsImportTasksPage: React.FC<StepsImportTasksProps> = (
    {
        ownedProjects, sharedProjects
    }
) => {
    const history = useHistory();
    const [projects, setProjects] = useState<Project[]>([]);
    const [projectId, setProjectId] = useState(-1);

    useEffect(() => {
        if (projects && projects[0]) setProjectId(projects[0].id);
        else setProjectId(-1);
    }, [projects]);

    useEffect(() => {
        setProjects([]);
        setProjects(flattenOwnedProject(ownedProjects, projects));
        setProjects(flattenSharedProject(sharedProjects, projects));
        setProjects(
            projects.filter((p) => {
                return p.projectType === ProjectType.TODO && !p.shared;
            })
        );
    }, [ownedProjects, sharedProjects]);

    const onGoSignIn = () => {
        window.location.href = 'https://bulletjournal.us';
    }

    const loginCookie = getCookie('__discourse_proxy');

    if (!loginCookie) {
        return <Result
            status="warning"
            title="Please Sign In"
            subTitle="You need a Bullet Journal account to save these tasks into your own project (BuJo)"
            extra={
                <Button type="primary" key="sign-in" onClick={onGoSignIn}>
                    Go to Bullet Journal Sign In Page
                </Button>
            }
        />
    }

    if (projects.length === 0) {
        return <div className='import-tasks-page'>
            <Result
                status="warning"
                title="Please Create a Project"
                subTitle="You need a TODO BuJo to save these tasks into it"
                extra={<AddProject history={history} mode={'singular'}/>}
            />
        </div>
    }

    return <div className='import-tasks-page'>
        <Tooltip title="Choose BuJo" placement="topLeft">
            <Select
                style={{width: '85%'}}
                placeholder="Choose BuJo"
                value={projectId}
                onChange={(value: any) => {
                    setProjectId(value);
                }}
            >
                {projects.map((project) => {
                    return (
                        <Option value={project.id} key={project.id}>
                            <Tooltip
                                title={`${project.name} (Group ${project.group.name})`}
                                placement="right"
                            >
                    <span>
                      <Avatar size="small" src={project.owner.avatar}/>
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

};

const mapStateToProps = (state: IState) => ({
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared,
});

export default connect(mapStateToProps, {})(StepsImportTasksPage);
