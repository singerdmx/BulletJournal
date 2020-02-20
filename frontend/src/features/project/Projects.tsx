import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Projects, ProjectType } from './reducer';
import { updateProjects, createProjectByName } from './actions';

type ProjectsProps = {
  projects: Projects;
  updateProjects: () => void;
  createProjectByName: (
    description: string,
    name: string,
    projectType: ProjectType
  ) => void;
};

class ProjectList extends React.Component<ProjectsProps> {
  componentDidMount() {
    this.props.updateProjects();
  }

  render() {
    return (
      <div
        onClick={() =>
          this.props.createProjectByName(
            'aaaaaaabbbbbbbb',
            'aaaaas',
            ProjectType.LEDGER
          )
        }
      >
        project
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  owned: state.project.owned,
  shared: state.project.shared
});

export default connect(mapStateToProps, {
  updateProjects,
  createProjectByName
})(ProjectList);
