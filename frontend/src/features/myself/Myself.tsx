import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Icon, Popover } from 'antd';
import { withRouter, RouteComponentProps } from 'react-router';
import DropdownMenu from '../../components/dropdown-menu/dropdown-menu.component';
import Notifications from '../notification/Notifications';
import { IState } from '../../store/index';
import { updateMyself, updateExpandedMyself } from './actions';
import { updateGroups, groupUpdate } from '../group/actions';
import { updateNotifications } from '../notification/actions';

import './myself.styles.less';

type MyselfProps = {
  username: string;
  avatar: string;
  updateMyself: () => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
  updateGroups: () => void;
  updateNotifications: () => void;
  groupUpdate: () => void;
};

type PathProps = RouteComponentProps;

class Myself extends React.Component<MyselfProps & PathProps> {
  componentDidMount() {
    this.props.updateMyself();
  }

  handleRefreshOnClick = () => {
    this.props.updateExpandedMyself(true);
    this.props.updateGroups();
    this.props.updateNotifications();
    this.props.groupUpdate();
  };

  render() {
    return (
      <div className='myselfContainer'>
        <Icon type='plus' title='Create New BuJo' className='rotateIcon' />
        <Icon
          type='sync'
          title='Refresh'
          className='rotateIcon'
          onClick={this.handleRefreshOnClick}
        />
        <Notifications />
        <Popover
          content={
            <DropdownMenu
              username={this.props.username}
              history={this.props.history}
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
  avatar: state.myself.avatar
});

export default connect(mapStateToProps, {
  updateMyself,
  updateExpandedMyself,
  updateGroups,
  updateNotifications,
  groupUpdate
})(withRouter(Myself));
