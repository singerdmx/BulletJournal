import React from 'react';
import { connect } from 'react-redux';
import { updateGroups } from '../features/group/actions';
import { IState } from '../store';
import { GroupsWithOwner } from '../features/group/interfaces';
import GroupCard from '../components/group-card/group-card.component';
import { BackTop } from 'antd';

type GroupsProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};

class GroupsPage extends React.Component<GroupsProps> {
  componentDidMount() {
    this.props.updateGroups();
  }

  render() {
    const groupsByOwner = this.props.groups;
    return (
      <div className="groups-page">
        <BackTop />
        {groupsByOwner && groupsByOwner.map(groupOwner => {
            return groupOwner.groups.map(group => (
                <GroupCard group={group} />
            ))
        })}
      </div>
    );
  }
}
  
const mapStateToProps = (state: IState) => ({
    groups: state.group.groups
});

export default connect(mapStateToProps, {updateGroups})(GroupsPage);
