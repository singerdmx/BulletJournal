import React, {useEffect, useState} from 'react';
import './punch-card.styles.less';
import {Avatar, Empty, Select, Tooltip} from "antd";
import {IState} from "../../store";
import {connect} from "react-redux";
import {getSubscribedCategories, unsubscribedCategory, updateCategorySubscription} from "../../features/myself/actions";
import {SubscribedCategory} from "../../features/myself/interface";
import {renderCategory} from "../templates/categories.page";
import '../templates/category.styles.less';
import {Project, ProjectsWithOwner} from "../../features/project/interface";
import {flattenOwnedProject, flattenSharedProject} from "../projects/projects.pages";
import {ProjectType} from "../../features/project/constants";
import {CloseCircleTwoTone} from "@ant-design/icons";
import {iconMapper} from "../../components/side-menu/side-menu.component";

const {Option} = Select;

type TemplateSubscriptionsProps = {
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
    subscribedCategories: SubscribedCategory[];
    getSubscribedCategories: () => void;
    unsubscribedCategory: (categoryId: number, selectionId: number) => void;
    updateCategorySubscription: (categoryId: number, selectionId: number, projectId: number) => void;
};

const TemplateSubscriptions: React.FC<TemplateSubscriptionsProps> = (
    {
        subscribedCategories,
        ownedProjects,
        sharedProjects,
        getSubscribedCategories,
        unsubscribedCategory,
        updateCategorySubscription
    }) => {

    const [projects, setProjects] = useState<Project[]>([]);

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

    useEffect(() => {
        getSubscribedCategories();
    }, []);

    if (subscribedCategories.length === 0) {
        return <div className='events-card'>
            <Empty/>
        </div>
    }

    const unsubscribedUserCategory = (categoryId: number, selectionId: number) => {
        unsubscribedCategory(categoryId, selectionId);
    }

    return (
        <div className='categories-info'>
            {subscribedCategories.map(subscribedCategory => {
                return <div>
                    {renderCategory(subscribedCategory.category, undefined)}
                    <div className='selections-card'>
                        {subscribedCategory.selections.map((s, index) => {
                            const projectId = subscribedCategory.projects[index].id;
                            return <div className='selection-card'>
                                <div>
                                    <span className='selection-text'>{s.text}</span>{' '}
                                    <Tooltip title='Unsubscribe'>
                                        <CloseCircleTwoTone onClick={() => unsubscribedUserCategory(
                                            subscribedCategory.category.id, s.id)}/>
                                    </Tooltip>
                                </div>
                                <div>
                                    <Select
                                        style={{padding: '3px', minWidth: '40%', maxWidth: '90%'}}
                                        placeholder="Choose BuJo"
                                        onChange={(id: number) => {
                                            updateCategorySubscription(subscribedCategory.category.id, s.id, id);
                                        }}
                                        value={projectId}
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
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            })}
        </div>
    );
};

const mapStateToProps = (state: IState) => ({
    subscribedCategories: state.myself.subscribedCategories,
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared,
});

export default connect(mapStateToProps, {
    getSubscribedCategories,
    unsubscribedCategory,
    updateCategorySubscription
})(TemplateSubscriptions);
