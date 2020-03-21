import React, { useState, useEffect } from 'react';
import { Collapse, Empty, List, Tooltip, Avatar } from 'antd';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import {IState} from "../store";
import {GroupsWithOwner} from "../features/group/interface";
import {updateGroups} from "../features/group/actions";
import {Project, ProjectsWithOwner} from "../features/project/interface";
import {updateProjects} from "../features/project/actions";
import {iconMapper} from "../components/side-menu/side-menu.component";
import { TeamOutlined } from "@ant-design/icons";

const { Panel } = Collapse;

// props of projects
type ProjectsProps = {
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
            flattenedProjects.push(project);
        });
    });
    return flattenedProjects;
};

export const getGroupUsersNumberByProject = (
    groups: GroupsWithOwner[],
    project: Project
): number => {
    let result = 0;
    for (let groupWithOwner of groups) {
        for (let group of groupWithOwner.groups) {
            if (group.id === project.group.id) {
              result = group.users.length;
              break;
            }
        }
        if (result) {
            break;
        }
    }
    return result;
};

const ProjectsPage: React.FC<RouteComponentProps & GroupsProps & ProjectsProps> = props => {
    const { groups, ownedProjects, sharedProjects, updateGroups, updateProjects } = props;

    useEffect(() => {
        updateGroups();
        updateProjects();
    }, []);

    const getOwnedBuJo = (ownedProjects: Project[]) => {
        const projects = flattenOwnedProject(ownedProjects, []);
        if (projects && projects[0]) {
          return (
            <List itemLayout="horizontal" size="small">
              {projects.map(project => {
                return (
                  <Tooltip
                    key={project.id}
                    title={`Group: ${project.group.name}`}
                    placement="topLeft"
                  >
                  <List.Item
                    key={project.id}
                    actions={[
                      <span>
                        <TeamOutlined style={{ marginRight: 5 }} />
                        {getGroupUsersNumberByProject(groups, project)}
                      </span>
                    ]}
                  >
                  <List.Item.Meta
                    avatar={<Avatar size="small" src={project.ownerAvatar} />}
                    title={
                      <span>
                        {iconMapper[project.projectType]}
                        &nbsp;{project.name}
                      </span>
                    }
                    description={project.description}
                  />
                  </List.Item>
                  </Tooltip>
                );
              })}
            </List>
          );
        }
        return <Empty />;
    };

    const getSharedBuJo = (sharedProjects: ProjectsWithOwner[]) => {
        const projects = flattenSharedProject(sharedProjects, []);
        if (projects && projects[0]) {
          return (
            <List itemLayout="horizontal" size="small">
              {projects.map(project => {
                return (
                  <Tooltip
                    key={project.id}
                    title={`Group: ${project.group.name}`}
                    placement="topLeft"
                  >
                  <List.Item
                    key={project.id}
                    actions={[
                      <span>
                        <TeamOutlined style={{ marginRight: 5 }} />
                        {getGroupUsersNumberByProject(groups, project)}
                      </span>
                    ]}
                  >
                  <List.Item.Meta
                    avatar={<Avatar size="small" src={project.ownerAvatar} />}
                    title={
                      <span>
                        {iconMapper[project.projectType]}
                        &nbsp;{project.name}
                      </span>
                    }
                    description={project.description}
                  />
                  </List.Item>
                  </Tooltip>
                );
              })}
            </List>
          );
        }
        return <Empty />;
    };

    return (
        <div className='project' style={{paddingTop: '30px'}}>
            <Collapse defaultActiveKey={['OwnedBuJo', 'SharedBuJo']}>
                <Panel header="Owned BuJo" key="OwnedBuJo">
                    {getOwnedBuJo(ownedProjects)}
                </Panel>
                <Panel header="Shared BuJo" key="SharedBuJo">
                    {getSharedBuJo(sharedProjects)}
                </Panel>
            </Collapse>
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    groups: state.group.groups,
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared
});

export default connect(mapStateToProps, { updateGroups, updateProjects })(withRouter(ProjectsPage));
