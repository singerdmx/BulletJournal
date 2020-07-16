import React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { getGroup, deleteGroup } from '../../features/group/actions';
import { Group } from '../../features/group/interface';
import { IState } from '../../store';
import GroupCard from '../../components/group-card/group-card.component';

import './group.styles.less';
import {BackTop} from "antd";

type GroupPathParams = {
  groupId: string;
};

interface GroupPathProps extends RouteComponentProps<GroupPathParams> {
  groupId: string;
}

type GroupPageProps = {
  group: Group | undefined;
  getGroup: (groupId: number) => void;
};

class GroupPage extends React.Component<GroupPageProps & GroupPathProps> {
  componentDidMount() {
    const groupId = this.props.match.params.groupId.substring(5);
    this.props.getGroup(parseInt(groupId));
    if (this.props.group) {
      document.title = `Group ${this.props.group.name}`;
    }
  }

  componentDidUpdate(prevProps: GroupPathProps): void {
    const groupId = this.props.match.params.groupId.substring(5);
    if (groupId !== prevProps.match.params.groupId.substring(5)) {
      this.props.getGroup(parseInt(groupId));
    }
    if (this.props.group) {
      document.title = `Group ${this.props.group.name}`;
    }
  }

  render() {
    const { group } = this.props;
    if (!group) return null;
    return (
      <div className='group-page'>
        <BackTop />
        <GroupCard group={group} multiple={false}/>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  group: state.group.group,
  myself: state.myself,
});

export default connect(mapStateToProps, { getGroup, deleteGroup })(GroupPage);
