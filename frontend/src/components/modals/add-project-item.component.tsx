import React, { useState, useEffect } from 'react';
import {Avatar, Form, Modal, Select, Tooltip} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {GroupsWithOwner} from '../../features/group/interface';
import {createProjectByName} from '../../features/project/actions';
import {updateGroups} from '../../features/group/actions';
import {IState} from '../../store';
import {Project, ProjectsWithOwner} from '../../features/project/interface';
import {iconMapper} from "../side-menu/side-menu.component";

import './modals.styles.less';
import {flattenOwnedProject, flattenSharedProject} from "../../pages/projects.pages";

const {Option} = Select;

type ProjectItemProps = {
    mode: string;
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
}

//props of groups
type GroupProps = {
    groups: GroupsWithOwner[];
    updateGroups: () => void;
};

const AddProjectItem : React.FC<GroupProps & ProjectItemProps> = props => {

    const [projects, setProjects] = useState<Project[]>([]);
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const onCancel = () => setVisible(false);
    const openModal = () => {
        setVisible(true);
    };

    useEffect(() => {
        props.updateGroups();
        setProjects([]);
        setProjects(flattenOwnedProject(props.ownedProjects, projects));
        setProjects(flattenSharedProject(props.sharedProjects, projects));
    }, []);

    const getProjectSelections = () => {
        if (projects && projects[0]) {
            return (<Tooltip title='Choose BuJo' placement='topLeft'>
                <Select placeholder="Choose BuJo" style={{width: "100%"}} defaultValue={projects[0].id}>
                    {projects.map(project => {
                        return (
                            <Option value={project.id} key={project.id}>
                                <Tooltip title={project.owner} placement='right'>
                                    <span>
                                    <Avatar size="small" src={project.ownerAvatar}/>
                                            &nbsp; {iconMapper[project.projectType]}
                                            &nbsp; <strong>{project.name}</strong>
                                            &nbsp; (Group <strong>{project.group.name}</strong>)
                                    </span>
                                </Tooltip>
                            </Option>
                        );
                    })}
                </Select>
            </Tooltip>);
        }

        return <div></div>;
    };

    const getModal = () => {
        return (
            <Modal
                title='Create New BuJo Item'
                destroyOnClose
                centered
                okText="Create"
                visible={visible}
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then(values => {
                            console.log(values);
                            form.resetFields();
                        })
                        .catch(info => console.log(info));
                }}
            >
                <div>
                    {getProjectSelections()}
                </div>
            </Modal>)
    };

    const getDiv = () => {
        if (props.mode === 'MyBuJo') {
            return (
                <div>
                    <Tooltip placement="bottom" title='Create New BuJo Item'>
                        <h2 className='add-todo-button' onClick={openModal}>
                            <PlusOutlined/>
                        </h2>
                    </Tooltip>
                    {getModal()}
                </div>
            );
        }
        return (
            <div>
                <Tooltip placement="bottom" title='Create New BuJo Item'>
                    <PlusOutlined className='rotateIcon' onClick={openModal}/>
                </Tooltip>
                {getModal()}
            </div>
        );
    };

    return getDiv();
};

const mapStateToProps = (state: IState) => ({
    groups: state.group.groups,
    project: state.project.project,
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared
});

export default connect(mapStateToProps, {updateGroups, createProjectByName})(
    AddProjectItem
);
