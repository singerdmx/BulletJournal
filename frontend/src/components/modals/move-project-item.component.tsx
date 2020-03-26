import React, {useEffect, useState} from 'react';
import {Avatar, Button, Form, Modal, Select, Tooltip} from 'antd';
import {RightCircleOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {GroupsWithOwner} from '../../features/group/interface';
import {createProjectByName} from '../../features/project/actions';
import {updateGroups} from '../../features/group/actions';
import {IState} from '../../store';
import {Project, ProjectsWithOwner} from '../../features/project/interface';
import {iconMapper} from '../side-menu/side-menu.component';
import {History} from 'history';
import {moveTask} from '../../features/tasks/actions';
import {moveNote} from '../../features/notes/actions';
import {moveTransaction} from '../../features/transactions/actions';
import './modals.styles.less';
import {flattenOwnedProject, flattenSharedProject} from '../../pages/projects/projects.pages';

const {Option} = Select;

type ProjectItemProps = {
  type: string;
  projectItemId: number;
  project: Project;
  ownedProjects: Project[];
  sharedProjects: ProjectsWithOwner[];
};

//props of groups
type GroupProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
  moveNote: (noteId: number, targetProject: number) => void;
  moveTask: (taskId: number, targetProject: number) => void;
  moveTransaction: (trasactionId: number, targetProject: number) => void;
};

const MoveProjectItem: React.FC<GroupProps & ProjectItemProps> = props => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const onCancel = () => {
    setVisible(false);
  };
  const openModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    props.updateGroups();
    setProjects([]);
    setProjects(flattenOwnedProject(props.ownedProjects, projects));
    setProjects(flattenSharedProject(props.sharedProjects, projects));
    setProjects(projects.filter(p => p.projectType === props.type && p.id !== props.project.id));
  }, []);

  const moveProjectItem = (values: any) => {
    let projectId: number | undefined = values.project;
    if (!projectId) {
      projectId = projects[0].id;
    }
    
    switch (props.type) {
      case 'NOTE':
        props.moveNote(props.projectItemId, projectId);
        break;
      case 'TASK':
        props.moveTask(props.projectItemId, projectId);
        break;
      case 'TRANSACTION':
        props.moveTransaction(props.projectItemId, projectId);
        break;
    }
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

    return <div/>;
  };

  const getModal = () => {
    return (
        <Modal
            title='Move'
            destroyOnClose
            centered
            okText='Confirm'
            visible={visible}
            onCancel={onCancel}
            onOk={() => {
              form
                  .validateFields()
                  .then(values => {
                    form.resetFields();
                    moveProjectItem(values);
                  })
                  .catch(info => console.log(info));
            }}
        >
          <div>{getProjectSelections()}</div>
        </Modal>
    );
  };

  const getDiv = () => {
    if (projects.length === 0) {
      return null;
    }
    return (
        <div onClick={openModal} style={{cursor: 'pointer'}}>
          <span>Move</span>
          <RightCircleOutlined />
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

export default connect(mapStateToProps, {
  updateGroups,
  createProjectByName,
  moveNote,
  moveTask,
  moveTransaction
})(MoveProjectItem);