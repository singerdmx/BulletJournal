import React, {useEffect} from 'react';
import {Avatar, BackTop, Collapse, Empty, List, message, Popover, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {RouteComponentProps, withRouter} from 'react-router';
import {IState} from "../../store";
import {Group, GroupsWithOwner} from "../../features/group/interface";
import {updateGroups} from "../../features/group/actions";
import {Project, ProjectsWithOwner} from "../../features/project/interface";
import {updateProjects} from "../../features/project/actions";
import {iconMapper} from "../../components/side-menu/side-menu.component";
import {TeamOutlined} from "@ant-design/icons";

import './projects.styles.less';
import AddProject from "../../components/modals/add-project.component";
import {animation, IconFont, Item, Menu, MenuProvider} from "react-contexify";
import {theme as ContextMenuTheme} from "react-contexify/lib/utils/styles";
import CopyToClipboard from "react-copy-to-clipboard";
import {CopyOutlined} from "@ant-design/icons/lib";
import {getCookie} from "../../index";

const {Panel} = Collapse;

// props of projects
type ProjectsProps = {
    theme: string;
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
    updateProjects: () => void;
};
// props of groups
type GroupsProps = {
    groups: GroupsWithOwner[];
    updateGroups: () => void;
};

export const flattenOwnedProject = (
    ownedProjects: Project[],
    flattenedProjects: Project[]
) => {
    ownedProjects.forEach(project => {
        flattenOwnedProject(project.subProjects, flattenedProjects);
        flattenedProjects.push(project);
    });
    return flattenedProjects;
};

export const flattenSharedProject = (
    sharedProjects: ProjectsWithOwner[],
    flattenedProjects: Project[]
) => {
    sharedProjects.forEach(sharedProject => {
        sharedProject.projects.forEach(project => {
            flattenOwnedProject(project.subProjects, flattenedProjects);
            if (!project.shared) {
                flattenedProjects.push(project);
            }
        });
    });
    return flattenedProjects;
};

export const getGroupByProject = (
    groups: GroupsWithOwner[],
    project: Project
): Group => {
    let result: Group | null = null;
    for (let groupWithOwner of groups) {
        for (let group of groupWithOwner.groups) {
            if (group && project.group && group.id === project.group.id) {
                result = group;
                break;
            }
        }
        if (result) {
            break;
        }
    }
    return result!;
};

const ProjectsPage: React.FC<RouteComponentProps & GroupsProps & ProjectsProps> = props => {
    const {groups, theme, ownedProjects, sharedProjects, updateGroups, updateProjects} = props;

    useEffect(() => {
        const loginCookie = getCookie('__discourse_proxy');
        if (loginCookie) {
            updateGroups();
            updateProjects();
        }
        document.title = 'Bullet Journal - Journals';
    }, []);

    const handleClick = (projectId: number) => {
        props.history.push(`/projects/${projectId}`);
    };

    const getProject = (project: Project) => {
        const group = getGroupByProject(groups, project);
        let popContent = null;
        if (group) {
            popContent = <div>
                {group.users.map((u, index) => <p key={index}><Avatar size="small" src={u.avatar}/>&nbsp;{u.alias}</p>)}
            </div>;
        }
        return (
            <List.Item
                key={project.id}
                style={{cursor: 'pointer'}}
                onClick={e => handleClick(project.id)}
                actions={[
                    <Popover
                        title={project.group.name}
                        placement='right'
                        content={popContent}
                    >
                          <span>
                            <TeamOutlined style={{marginRight: 5}}/>
                              {group && group.users.length}
                          </span>
                    </Popover>
                ]}
            >
                <List.Item.Meta
                    avatar={
                        <Tooltip title={project.owner.alias} placement='left'>
                            <Avatar size="small" src={project.owner.avatar}/>
                        </Tooltip>
                    }
                    title={
                        <>
                            <MenuProvider id={`p${project.id}`}>
                              <span>
                                {iconMapper[project.projectType]}
                                    &nbsp;{project.name}
                              </span>
                            </MenuProvider>

                            <Menu id={`p${project.id}`}
                                  theme={theme === 'DARK' ? ContextMenuTheme.dark : ContextMenuTheme.light}
                                  animation={animation.zoom}>
                                <CopyToClipboard
                                    text={`${project.name} ${window.location.origin.toString()}/#/projects/${project.id}`}
                                    onCopy={() => message.success('Link Copied to Clipboard')}
                                >
                                    <Item>
                                        <IconFont
                                            style={{fontSize: '14px', paddingRight: '6px'}}><CopyOutlined/></IconFont>
                                        <span>Copy Link Address</span>
                                    </Item>
                                </CopyToClipboard>
                            </Menu>
                        </>
                    }
                    description={project.description}
                />
            </List.Item>
        );
    };

    const getOwnedBuJo = (ownedProjects: Project[]) => {
        const projects = flattenOwnedProject(ownedProjects, []);
        if (projects && projects[0]) {
            return (
                <List itemLayout="horizontal" size="small">
                    {projects.map(project => getProject(project))}
                </List>
            );
        }
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
    };

    const getSharedBuJo = (sharedProjects: ProjectsWithOwner[]) => {
        const projects = flattenSharedProject(sharedProjects, []);
        if (projects && projects[0]) {
            return (
                <List itemLayout="horizontal" size="small">
                    {projects.map(project => getProject(project))}
                </List>
            );
        }
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>;
    };

    return (
        <div className='projects' style={{paddingTop: '30px'}}>
            <BackTop />
            <Collapse defaultActiveKey={['OwnedBuJo', 'SharedBuJo']}>
                <Panel header="BuJo Created by Me" key="OwnedBuJo">
                    {getOwnedBuJo(ownedProjects)}
                </Panel>
                <Panel header="BuJo Shared with Me" key="SharedBuJo">
                    {getSharedBuJo(sharedProjects)}
                </Panel>
            </Collapse>
            <AddProject history={props.history} mode={'float'} />
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    groups: state.group.groups,
    theme: state.myself.theme,
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared
});

export default connect(mapStateToProps, {updateGroups, updateProjects})(withRouter(ProjectsPage));
