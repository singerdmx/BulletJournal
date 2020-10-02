import React from 'react';
import { connect } from 'react-redux';
import { updateGroups } from '../../features/group/actions';
import { IState } from '../../store';
import { GroupsWithOwner } from '../../features/group/interface';
import GroupCard from '../../components/group-card/group-card.component';
import { BackTop } from 'antd';

import './groups.styles.less';
import {getCookie} from "../../index";

type GroupsProps = {
  groups: GroupsWithOwner[];
  updateGroups: () => void;
};

class GroupsPage extends React.Component<GroupsProps> {
  componentDidMount() {
    document.title = 'Bullet Journal - Groups';
    const loginCookie = getCookie('__discourse_proxy');
    if (loginCookie) {
      this.props.updateGroups();
    }
  }

  render() {
    const groupsByOwner = this.props.groups;
    return (
      <div className="groups-page">
        <BackTop />
        {groupsByOwner && groupsByOwner.map(groupOwner => {
            return groupOwner.groups.map(group => (
                <GroupCard key={`${group.id}-${group.users.length}`} group={group} multiple={true}/>
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
