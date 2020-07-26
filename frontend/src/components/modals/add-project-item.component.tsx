import React, { useEffect, useState } from 'react';
import { Avatar, Form, Modal, Select, Tooltip, Button } from 'antd';
import { PlusCircleFilled, PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { createProjectByName } from '../../features/project/actions';
import { IState } from '../../store';
import { Project, ProjectsWithOwner } from '../../features/project/interface';
import { iconMapper } from '../side-menu/side-menu.component';
import { History } from 'history';
import { updateTaskVisible } from '../../features/tasks/actions';
import { updateNoteVisible } from '../../features/notes/actions';
import { updateTransactionVisible } from '../../features/transactions/actions';
import './modals.styles.less';
import {
  flattenOwnedProject,
  flattenSharedProject,
} from '../../pages/projects/projects.pages';

const { Option } = Select;

type ProjectItemProps = {
  history: History<History.PoorMansUnknown>;
  mode: string;
  ownedProjects: Project[];
  sharedProjects: ProjectsWithOwner[];
};

//props of groups
type GroupProps = {
  updateTaskVisible: (addTaskVisible: boolean) => void;
  updateNoteVisible: (addNoteVisible: boolean) => void;
  updateTransactionVisible: (addTransactionVisible: boolean) => void;
};

const AddProjectItem: React.FC<GroupProps & ProjectItemProps> = (props) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);

  const onCancel = () => setVisible(false);
  const openModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    setProjects([]);
    setProjects(flattenOwnedProject(props.ownedProjects, projects));
    setProjects(flattenSharedProject(props.sharedProjects, projects));
  }, []);

  const addBuJoItem = (values: any) => {
    let project: string = values.project;
    if (!project) {
      project = getProjectValue(projects[0]);
    }

    props.history.push(`/projects/${project.split('#')[1]}`);
    const type = project.split('#')[0];
    if (type === 'TODO') {
      props.updateTaskVisible(true);
    } else if (type === 'NOTE') {
      props.updateNoteVisible(true);
    } else if (type === 'LEDGER') {
      props.updateTransactionVisible(true);
    }
    setVisible(false);
  };

  const getProjectValue = (project: Project) => {
    return project.projectType + '#' + project.id;
  };

  const getProjectSelections = () => {
    if (projects && projects[0]) {
      return (
        <Form form={form} labelAlign='left'>
          <Tooltip title='Choose BuJo' placement='topLeft'>
            <Form.Item name='project'>
              <Select
                placeholder='Choose BuJo'
                style={{ width: '100%' }}
                defaultValue={getProjectValue(projects[0])}
              >
                {projects.map((project) => {
                  return (
                    <Option value={getProjectValue(project)} key={project.id}>
                      <Tooltip
                        title={project.owner.alias}
                        placement='right'
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
            </Form.Item>
          </Tooltip>
        </Form>
      );
    }

    return <div />;
  };

  const getModal = () => {
    return (
      <Modal
        title='Create New BuJo Item'
        destroyOnClose
        centered
        okText='Create'
        visible={visible}
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              addBuJoItem(values);
            })
            .catch((info) => console.log(info));
        }}
      >
        <div>{getProjectSelections()}</div>
      </Modal>
    );
  };

  const getDiv = () => {
    if (props.mode === 'MyBuJo') {
      return (
        <div>
          <Tooltip placement='bottom' title='Create New BuJo Item'>
            <h2 className='add-todo-button' onClick={openModal}>
              <Button type="primary" shape="round" icon={<PlusCircleFilled />}>
                Create
              </Button>
            </h2>
          </Tooltip>
          {getModal()}
        </div>
      );
    }
    return (
      <div>
        <Tooltip placement='bottom' title='Create New BuJo Item'>
          <PlusOutlined className='rotateIcon' onClick={openModal} />
        </Tooltip>
        {getModal()}
      </div>
    );
  };

  return getDiv();
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  ownedProjects: state.project.owned,
  sharedProjects: state.project.shared,
});

export default connect(mapStateToProps, {
  createProjectByName,
  updateTaskVisible,
  updateNoteVisible,
  updateTransactionVisible,
})(AddProjectItem);
