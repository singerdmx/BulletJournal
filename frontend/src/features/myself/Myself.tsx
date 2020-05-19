import React from 'react';
import { connect } from 'react-redux';
import { SyncOutlined } from '@ant-design/icons';
import { Avatar, Popover, Tooltip } from 'antd';
import { RouteComponentProps, withRouter } from 'react-router';
import DropdownMenu from '../../components/dropdown-menu/dropdown-menu.component';
import Notifications from '../notification/Notifications';
import { IState } from '../../store/index';
import AddProject from '../../components/modals/add-project.component';
import AddProjectItem from '../../components/modals/add-project-item.component';
import { Project, ProjectsWithOwner } from '../project/interface';
import { updateExpandedMyself, updateMyself } from './actions';
import { groupUpdate, updateGroups } from '../group/actions';
import { updateNotifications } from '../notification/actions';
import { updateSystem } from '../system/actions';

import './myself.styles.less';

type MyselfProps = {
  username: string;
  avatar: string;
  ownedProjects: Project[];
  sharedProjects: ProjectsWithOwner[];
  updateMyself: () => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
  updateGroups: () => void;
  updateNotifications: () => void;
  groupUpdate: () => void;
  updateSystem: () => void;
};

type ModalState = {
  showContactUs: boolean;
}

type PathProps = RouteComponentProps;

class Myself extends React.Component<MyselfProps & PathProps, ModalState> {
  state: ModalState = {
    showContactUs: false
  };

  interval: any = 0;

  componentDidMount() {
    this.props.updateMyself();
    this.interval = setInterval(() => {
      this.props.updateSystem();
    }, 50000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  handleRefreshOnClick = () => {
    this.props.updateExpandedMyself(true);
    this.props.updateSystem();
  };

  render() {
    let plusIcon = null;
    if (this.props.ownedProjects.length === 0 && this.props.sharedProjects.length === 0) {
      plusIcon = <AddProject history={this.props.history} mode={'complex'} />
    } else {
      plusIcon = <AddProjectItem history={this.props.history} mode={'complex'} />
    }
    return (
      <div className='myselfContainer'>
        {plusIcon}
        <Tooltip placement="bottom" title='Refresh' >
          <SyncOutlined
            className='rotateIcon'
            onClick={this.handleRefreshOnClick} />
        </Tooltip>
        <Notifications />
        <Popover
          content={
            <DropdownMenu
                username={this.props.username}
                history={this.props.history}
                showContactUs={this.state.showContactUs}
                onCancelShowContactUs={() => {
                  this.setState({ showContactUs: false });
                  console.log(this.state.showContactUs)
                }}
                handleContact={() => {
                  this.setState({ showContactUs: true });
                }}
            />
          }
          trigger='click'
          placement='bottomRight'
        >
          <Avatar
            src={this.props.avatar}
            style={{ cursor: 'pointer', flexShrink: 1 }}
            size={28}
          >
            {this.props.username || 'User'}
          </Avatar>
        </Popover>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  username: state.myself.username,
  avatar: state.myself.avatar,
  ownedProjects: state.project.owned,
  sharedProjects: state.project.shared
});

export default connect(mapStateToProps, {
  updateMyself,
  updateExpandedMyself,
  updateGroups,
  updateNotifications,
  groupUpdate,
  updateSystem
})(withRouter(Myself));
