import React from "react";
import {IState} from "../../store";
import {Project} from "../../features/project/interface";
import {connect} from "react-redux";

type SearchCompletedTasksProps = {
    project: Project | undefined;
}

const SearchCompletedTasksPage: React.FC<SearchCompletedTasksProps> = (props) => {
    return <div className='project'></div>
};

const mapStateToProps = (state: IState) => ({
    project: state.project.project,
});

export default connect(mapStateToProps, {})(SearchCompletedTasksPage);

