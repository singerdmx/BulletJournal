import React, { useEffect, useState } from 'react';
import { Avatar, Form, Modal, Select, Tooltip } from 'antd';
import { useHistory } from 'react-router-dom';
import { RightCircleOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { createProjectByName } from '../../features/project/actions';
import { IState } from '../../store';
import { Project, ProjectsWithOwner } from '../../features/project/interface';
import { iconMapper } from '../side-menu/side-menu.component';
import { moveTask } from '../../features/tasks/actions';
import { moveNote } from '../../features/notes/actions';
import { moveTransaction } from '../../features/transactions/actions';
import { History } from 'history';
import './modals.styles.less';
import {
  flattenOwnedProject,
  flattenSharedProject,
} from '../../pages/projects/projects.pages';
import {
  getProjectItemType,
  ProjectType,
} from '../../features/project/constants';

const { Option } = Select;

type ProjectItemProps = {
  mode: string;
  type: ProjectType;
  projectItemId: number;
  project: Project | undefined;
  ownedProjects: Project[];
  sharedProjects: ProjectsWithOwner[];
};

//props of groups
type GroupProps = {
  moveNote: (noteId: number, targetProject: number, history: History) => void;
  moveTask: (taskId: number, targetProject: number, history: History) => void;
  moveTransaction: (
    transactionId: number,
    targetProject: number,
    history: History
  ) => void;
};

const MoveProjectItem: React.FC<GroupProps & ProjectItemProps> = (props) => {
  const { mode } = props;
  const [projects, setProjects] = useState<Project[]>([]);
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const history = useHistory();

  const handleCancel = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    setVisible(false);
  };

  const openModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    let updateProjects = [] as Project[];
    updateProjects = flattenOwnedProject(props.ownedProjects, updateProjects);
    updateProjects = flattenSharedProject(props.sharedProjects, updateProjects);
    updateProjects = updateProjects.filter((p) => {
      if (!props.project) {
        return true;
      }
      return (
        p.projectType === props.type && p.id !== props.project.id && !p.shared
      );
    });
    setProjects(updateProjects);
  }, [props.ownedProjects, props.sharedProjects]);

  const moveProjectItem = (values: any) => {
    let projectId: number | undefined = values.project;
    if (!projectId) {
      projectId = projects[0].id;
    }

    switch (props.type) {
      case ProjectType.NOTE:
        props.moveNote(props.projectItemId, projectId, history);
        break;
      case ProjectType.TODO:
        props.moveTask(props.projectItemId, projectId, history);
        break;
      case ProjectType.LEDGER:
        props.moveTransaction(props.projectItemId, projectId, history);
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
                style={{ width: '100%' }}
                defaultValue={projects[0].id}
              >
                {projects.map((project) => {
                  return (
                    <Option value={project.id} key={project.id}>
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

    return <React.Fragment />;
  };

  const getModal = () => {
    return (
      <Modal
        title={`MOVE ${getProjectItemType(props.type)}`}
        destroyOnClose={true}
        centered
        okText='Confirm'
        visible={visible}
        onCancel={(e) => handleCancel(e)}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              form.resetFields();
              moveProjectItem(values);
            })
            .catch((info) => console.log(info));
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
    if (mode === 'div') {
      return (
        <div onClick={openModal} className='popover-control-item'>
          <span>Move</span>
          <RightCircleOutlined />
          {getModal()}
        </div>
      );
    } else {
      return (
        <Tooltip title={`MOVE ${getProjectItemType(props.type)}`}>
          <div>
            <span onClick={openModal}>
              <RightCircleOutlined />
              {getModal()}
            </span>
          </div>
        </Tooltip>
      );
    }
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
  moveNote,
  moveTask,
  moveTransaction,
})(MoveProjectItem);
