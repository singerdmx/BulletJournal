import React, { useState, useEffect } from 'react';
import {
    Collapse,
    Empty
} from 'antd';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import {IState} from "../store";
import {GroupsWithOwner} from "../features/group/interface";
import {updateGroups} from "../features/group/actions";
import {Project, ProjectsWithOwner} from "../features/project/interface";
import {updateProjects} from "../features/project/actions";

const { Panel } = Collapse;

// props of projects
type ProjectsProps = {
    ownProjects: Project[];
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
};

const ProjectsPage: React.FC<RouteComponentProps & GroupsProps & ProjectsProps> = props => {

    useEffect(() => {
        props.updateGroups();
        props.updateProjects();
    }, []);

    const getOwnedBuJo = () => {
        return <Empty />;
    };

    const getSharedBuJo = () => {
        return <Empty />;
    };

    return (
        <div className='project' style={{paddingTop: '30px'}}>
            <Collapse defaultActiveKey={['OwnedBuJo', 'SharedBuJo']}>
                <Panel header="Owned BuJo" key="OwnedBuJo">
                    {getOwnedBuJo()}
                </Panel>
                <Panel header="Shared BuJo" key="SharedBuJo">
                    {getSharedBuJo()}
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
