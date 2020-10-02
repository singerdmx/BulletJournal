import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Projects } from './reducer';
import { updateProjects, createProjectByName } from './actions';
import { ProjectType } from './constants';
import { History } from 'history';
import {getCookie} from "../../index";

type ProjectsProps = {
  projects: Projects;
  updateProjects: () => void;
  createProjectByName: (
    description: string,
    groupId: number,
    name: string,
    projectType: ProjectType,
    history: History<History.PoorMansUnknown>
  ) => void;
};

class ProjectList extends React.Component<ProjectsProps> {
  componentDidMount() {
    const loginCookie = getCookie('__discourse_proxy');
    if (loginCookie) {
      this.props.updateProjects();
    }
  }

  render() {
    return <div>project</div>;
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
