import React, {useEffect, useState} from "react";
import {IState} from "../../store";
import {connect} from 'react-redux';
import {Project, ProjectsWithOwner} from "../../features/project/interface";
import {flattenOwnedProject, flattenSharedProject} from "../../pages/projects/projects.pages";
import {ProjectType} from "../../features/project/constants";
import {Avatar, Card, Form, Modal, Select, Tooltip} from "antd";
import {iconMapper} from "../side-menu/side-menu.component";
import AddProject from "./add-project.component";
import {useHistory} from "react-router-dom";
import {CalendarListEntry} from "../../features/calendarSync/interface";

const {Option} = Select;

type ModalProps = {
    ownedProjects: Project[];
    sharedProjects: ProjectsWithOwner[];
    calendar: CalendarListEntry;
}

const CalendarListEntryModal: React.FC<ModalProps> = props => {
    const {calendar} = props;
    const [visible, setVisible] = useState(false);
    const [projects, setProjects] = useState<Project[]>([]);
    const history = useHistory();
    const [form] = Form.useForm();

    useEffect(() => {
        setProjects([]);
        setProjects(flattenOwnedProject(props.ownedProjects, projects));
        setProjects(flattenSharedProject(props.sharedProjects, projects));
        setProjects(
            projects.filter(p => {
                return (
                    p.projectType === ProjectType.TODO && !p.shared
                );
            })
        );
    }, [props.ownedProjects, props.sharedProjects]);

    const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        e.stopPropagation();
        setVisible(false);
    };

    const getProjectSelections = () => {
        if (projects && projects[0]) {
            return (
                <Form form={form} labelAlign='left'>
                    <Tooltip title='Choose BuJo' placement='topLeft'>
                        <Form.Item name='project'>
                            <Select
                                placeholder='Choose BuJo'
                                style={{width: '100%'}}
                                defaultValue={projects[0].id}
                            >
                                {projects.map(project => {
                                    return (
                                        <Option value={project.id} key={project.id}>
                                            <Tooltip title={project.owner} placement='right'>
                        <span>
                          <Avatar size='small' src={project.ownerAvatar}/>
                            &nbsp; {iconMapper[project.projectType]}
                            &nbsp; <strong>{project.name}</strong>
                            &nbsp; (Group <strong>{project.group.name}</strong>)
                        </span>
                                            </Tooltip>
                                        </Option>
                                    );
                                })}
                            </Select>
                        </Form.Item>
                    </Tooltip>
                </Form>
            );
        }

        return <AddProject history={history} mode={'singular'}/>;
    };

    return <div onClick={() => setVisible(true)}>
        <span>{calendar.summary}</span>
        <Modal
            destroyOnClose
            centered
            title='Sync Calendar'
            visible={visible}
            okText='Confirm'
            onCancel={(e) => handleCancel(e)}
            onOk={() => {
                form
                    .validateFields()
                    .then((values) => {
                        console.log(values);
                        form.resetFields();
                    })
                    .catch((info) => console.log(info));
            }}
        >
            <Form form={form} labelAlign='left'>
                <Form.Item
                    name='project'
                    label='Target BuJo'
                    labelCol={{span: 5}}
                    wrapperCol={{span: 19}}
                >
                    {getProjectSelections()}
                </Form.Item>
            </Form>
        </Modal>
    </div>
};

const mapStateToProps = (state: IState) => ({
    ownedProjects: state.project.owned,
    sharedProjects: state.project.shared,
});

export default connect(mapStateToProps, {})(CalendarListEntryModal);