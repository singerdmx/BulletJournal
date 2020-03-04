import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Project } from '../features/project/interfaces';
import { IState } from '../store';
import { connect } from 'react-redux';
import { Menu, Dropdown, Avatar } from 'antd';
import { getProject } from '../features/project/actions';
import { iconMapper } from '../components/side-menu/side-menu.compoennt';
import { TeamOutlined, MoreOutlined, EditOutlined } from '@ant-design/icons';

type ProjectPathParams = {
  projectId: string;
};

interface ProjectPathProps extends RouteComponentProps<ProjectPathParams> {
  projectId: string;
}

type ProjectPageProps = {
  project: Project;
  getProject: (projectId: number) => void;
};

const editMenu = (
  <Menu>
    <Menu.Item key="changeName">
      <EditOutlined />
      &nbsp;Change Name
    </Menu.Item>
    <Menu.Item key="changeGroup">
      <EditOutlined />
      &nbsp;Change Group
    </Menu.Item>
    <Menu.Item key="changeDescription">
      <EditOutlined />
      &nbsp;Change Description
    </Menu.Item>
  </Menu>
);

class ProjectPage extends React.Component<ProjectPageProps & ProjectPathProps> {
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

  render() {
    const { project } = this.props;
    return (
      <div className="project">
        <div className="project-header">
          <h2>
            <span title={project.owner}>
              <Avatar size="large" src={project.ownerAvatar} />
            </span>
            &nbsp;&nbsp;&nbsp;
            <span title={`${project.projectType} ${project.name}`}>
              {iconMapper[project.projectType]}
              &nbsp;{project.name}
            </span>
          </h2>

          <div className="project-control">
            <span style={{cursor: 'pointer'}}>
              <h2
                onClick={e => this.onClickGroup(project.group.id)}
                title={project.group && `Group: ${project.group.name}`}
              >
                <TeamOutlined />
                {project.group && project.group.users.length}
              </h2>
            </span>
            <Dropdown overlay={editMenu} trigger={['click']}>
              <h2 style={{ cursor: 'pointer', marginLeft: '0.5em' }}>
                <MoreOutlined title="Edit" />
              </h2>
            </Dropdown>
          </div>
          
        </div>
        <div>{project.description}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  project: state.project.project
});

export default connect(mapStateToProps, { getProject })(ProjectPage);
