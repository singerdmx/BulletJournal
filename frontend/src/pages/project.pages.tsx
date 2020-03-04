import React from 'react';
import { RouteComponentProps } from 'react-router';
import { Project } from '../features/project/interfaces';
import { IState } from '../store';
import { connect } from 'react-redux';
import { getProject } from '../features/project/actions';
import {
  TeamOutlined
} from '@ant-design/icons';

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
      <div className='todo'>
        <div className='todo-header'>
          <h2>{project.name}</h2>
          <h2 className='add-todo-button'
            title={project.group && `Group: ${project.group.name}`}
            onClick={(e) => this.onClickGroup(project.group.id)}>
            <TeamOutlined /> {project.group && project.group.users.length}
          </h2>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
});

export default connect(mapStateToProps, { getProject })(ProjectPage);
