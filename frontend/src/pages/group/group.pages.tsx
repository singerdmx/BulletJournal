import React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { getGroup, deleteGroup } from '../../features/group/actions';
import { Group } from '../../features/group/interface';
import { IState } from '../../store';
import GroupCard from '../../components/group-card/group-card.component';

import './group.styles.less';

type GroupPathParams = {
  groupId: string;
};

interface GroupPathProps extends RouteComponentProps<GroupPathParams> {
  groupId: string;
}

type GroupPageProps = {
  group: Group;
  getGroup: (groupId: number) => void;
};

class GroupPage extends React.Component<GroupPageProps & GroupPathProps> {

  componentDidMount() {
    const groupId = this.props.match.params.groupId.substring(5);
    this.props.getGroup(parseInt(groupId));
  }

  componentDidUpdate(prevProps: GroupPathProps): void {
    const groupId = this.props.match.params.groupId.substring(5);
    if (groupId !== prevProps.match.params.groupId.substring(5)) {
      this.props.getGroup(parseInt(groupId));
    }
  }

  render() {
    const { group } = this.props;
    return (
      <div className='group-page'>
        <GroupCard group={group} />
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  group: state.group.group,
  myself: state.myself
});

export default connect(mapStateToProps, { getGroup, deleteGroup })(GroupPage);
