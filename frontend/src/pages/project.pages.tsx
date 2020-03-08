import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Project } from '../features/project/interface';
import { IState } from '../store';
import { connect } from 'react-redux';
import { GroupsWithOwner } from '../features/group/interface';
import { Avatar, Popconfirm, Tooltip } from 'antd';
import { getProject } from '../features/project/actions';
import { iconMapper } from '../components/side-menu/side-menu.compoennt';
import { TeamOutlined, DeleteOutlined } from '@ant-design/icons';
import EditProject from '../components/modals/edit-project.component';
import AddNote from '../components/modals/add-note.component';
import AddTask from '../components/modals/add-task.component';
import AddTransaction from '../components/modals/add-transaction.component';
import { ProjectType } from '../features/project/constants';
import { deleteProject } from '../features/project/actions';
import { NoteTree } from '../components/note-tree';

type ProjectPathParams = {
  projectId: string;
};

type ModalState = {
  isShow: boolean;
  groupName: string;
};

type GroupProps = {
  groups: GroupsWithOwner[];
};

interface ProjectPathProps extends RouteComponentProps<ProjectPathParams> {
  projectId: string;
}

type ProjectPageProps = {
  project: Project;
  getProject: (projectId: number) => void;
  deleteProject: (projectId: number, name: string) => void;
};

type MyselfProps = {
  myself: string;
};

class ProjectPage extends React.Component<
  ProjectPageProps & ProjectPathProps & GroupProps & MyselfProps,
  ModalState
> {
  state: ModalState = {
    isShow: false,
    groupName: ''
  };

  componentDidMount() {
    const projectId = this.props.match.params.projectId;
    this.props.getProject(parseInt(projectId));
  }

  componentDidUpdate(prevProps: ProjectPathProps): void {
    const projectId = this.props.match.params.projectId;
    if (projectId !== prevProps.match.params.projectId) {
      this.props.getProject(parseInt(projectId));
    }
  }

  onClickGroup = (groupId: number) => {
    this.props.history.push(`/groups/group${groupId}`);
  };

  saveProject = () => {
    this.setState({ isShow: false });
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };

  render() {
    const { project, myself } = this.props;

    let createContent = null;
    switch (project.projectType) {
      case ProjectType.NOTE:
        createContent = <AddNote />;
        break;
      case ProjectType.TODO:
        createContent = <AddTask />;
        break;
      case ProjectType.LEDGER:
        createContent = <AddTransaction />;
    }

    let editContent = null;
    let deleteContent = null;
    if (myself === project.owner) {
      editContent = <EditProject />;
      deleteContent = (
        <Popconfirm
          title='Are you sure?'
          okText='Yes'
          cancelText='No'
          onConfirm={() => {
            this.props.deleteProject(project.id, project.name);
            this.props.history.push('/projects');
          }}
          className='group-setting'
          placement='bottom'
        >
          <DeleteOutlined
            title='Delete Project'
            style={{
              fontSize: 20,
              marginLeft: '10px',
              cursor: 'pointer',
              marginBottom: '0.5em'
            }}
          />
        </Popconfirm>
      );
    }

    return (
      <div className='project'>
        <div className='project-header'>
          <h2>
            <Tooltip placement='top' title={project.owner}>
              <span>
                <Avatar size='large' src={project.ownerAvatar} />
              </span>
            </Tooltip>
            &nbsp;&nbsp;&nbsp;
            <Tooltip
              placement='top'
              title={`${project.projectType} ${project.name}`}
            >
              <span>
                {iconMapper[project.projectType]}
                &nbsp;{project.name}
              </span>
            </Tooltip>
          </h2>

          <div className='project-control'>
            <span style={{ cursor: 'pointer' }}>
              <Tooltip
                placement='top'
                title={project.group && `Group: ${project.group.name}`}
              >
                <h2 onClick={e => this.onClickGroup(project.group.id)}>
                  <TeamOutlined />
                  {project.group && project.group.users.length}
                </h2>
              </Tooltip>
            </span>

            {createContent}
            {editContent}
            {deleteContent}
          </div>
        </div>
        <div className='project-content'><NoteTree /></div>
        <div>{project.description}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  groups: state.group.groups,
  myself: state.myself.username
});

export default connect(mapStateToProps, { getProject, deleteProject })(
  ProjectPage
);
