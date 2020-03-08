import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { GroupsWithOwner } from './interface';
import { updateGroups, createGroupByName } from './actions';

type GroupsProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
  createGroupByName: (name: string) => void;
};

class GroupList extends React.Component<GroupsProps> {
  componentDidMount() {
    this.props.updateGroups();
  }
  render(){
    return (<div onClick ={()=> this.props.createGroupByName('TestPEnggfdfdds')}>group</div>)
  }
}

const mapStateToProps = (state: IState) => ({
  groups: state.group.groups
});

export default connect(mapStateToProps, { updateGroups, createGroupByName })(GroupList);
