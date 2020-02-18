import React from 'react';
import { connect } from 'react-redux';
import { Avatar, Icon, Popover } from 'antd';
import DropdownMenu from '../../components/dropdown-menu/dropdown-menu.component';
import Notifications from '../notification/Notifications';
import { IState } from '../../store/index';
import { updateMyself } from './reducer';

type MyselfProps = {
  username: string;
  avatar: string;
  updateMyself: () => void;
};

class Myself extends React.Component<MyselfProps> {
  componentDidMount() {
    this.props.updateMyself();
  }
  render() {
    return (
      <div
        style={{
          display: 'flex',
          width: '100px',
          justifyContent: 'space-around',
          alignItems: 'center',
          fontSize: '20px',
          color: 'white'
        }}
      >
        <Icon type='plus' />

        <Popover
          content={<DropdownMenu username={this.props.username} />}
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

export default connect(mapStateToProps, { updateMyself })(Myself);
