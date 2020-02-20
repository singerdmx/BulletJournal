import React from 'react';
import { RouteComponentProps } from 'react-router';
import { connect } from 'react-redux';
import { getGroup } from '../features/group/actions';
import { Group } from '../features/group/reducer';
import { IState } from '../store';
import { Icon, Avatar, Button, List } from 'antd';

type GroupPathParams = {
  groupId: string;
};

interface GroupPathProps extends RouteComponentProps<GroupPathParams> {
  groupId: string;
}

type GroupProps = {
  group: Group;
  getGroup: (groupId: number) => void;
};

class GroupPage extends React.Component<GroupProps & GroupPathProps> {
  componentDidMount() {
    const groupId = this.props.match.params.groupId;
    console.log(groupId);
    this.props.getGroup(parseInt(groupId));
  }

  componentDidUpdate(prevProps: GroupPathProps): void {
    const groupId = this.props.match.params.groupId;
    if (groupId !== prevProps.match.params.groupId) {
      this.props.getGroup(parseInt(groupId));
    }
  }
  render() {
    const { group } = this.props;
    return (
      <div className="group-page">
        <div className="group-title">
          <h3>
            {group.name} Group of {group.owner}
          </h3>
          <Icon type="dash" />
        </div>
        <div className="group-users">
          <List
            dataSource={group.users}
            renderItem={item => {
              return (
                <List.Item key={item.id}>
                  <div className="group-user">
                    <Avatar src={item.avatar} />
                    {item.name}
                  </div>
                  {item.name !== group.owner && <Button type="danger" icon="close" ghost size="small" />}
                </List.Item>
              );
            }}
          />
        </div>
        <div className="group-footer">
          <Button type="primary" icon="plus" shape="round" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  group: state.group.group
});

export default connect(mapStateToProps, { getGroup })(GroupPage);
