import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { updateGroups, Group } from './reducer';

type GroupsProps = {
  groups: Group[];
  updateGroups: () => void;
};

class GroupList extends React.Component<GroupsProps> {
  componentDidMount() {
    this.props.updateGroups();
  }
}

const mapStateToProps = (state: IState) => ({
  groups: state.group.groups
});

export default connect(mapStateToProps, { updateGroups })(GroupList);
