import React from 'react';
import { Modal, Input, Button, Tooltip } from 'antd';
import { UsergroupAddOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps} from 'react-router';
import { createGroupByName } from '../../features/group/actions';

import './modals.styles.less';

type GroupProps = {
  createGroupByName: (name: string) => void;
};

type ModalState = {
  isShow: boolean;
  groupName: string;
};

class AddGroup extends React.Component<GroupProps & RouteComponentProps, ModalState> {
  state: ModalState = {
    isShow: false,
    groupName: ''
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  addGroup = () => {
    this.props.createGroupByName(this.state.groupName);
    this.setState({ isShow: false });
    this.props.history.push("/groups")
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };

  render() {
    return (
      <Tooltip placement="top" title='Create New Group'>
        <div className="add-group">
          <Button onClick={this.showModal} type="dashed" block>
            <UsergroupAddOutlined style={{ fontSize: 20 }} />
          </Button>
          <Modal
            title="Create New Group"
            visible={this.state.isShow}
            onCancel={this.onCancel}
            onOk={() => this.addGroup}
            footer={[
              <Button key="cancel" onClick={this.onCancel}>
                Cancel
              </Button>,
              <Button key="create" type="primary" onClick={this.addGroup}>
                Create
              </Button>
            ]}
          >
            <Input
              placeholder="Enter Group Name"
              onChange={e => this.setState({ groupName: e.target.value })}
              onPressEnter={this.addGroup}
              allowClear
            />
          </Modal>
        </div>
      </Tooltip>
    );
  }
}

export default connect(null, { createGroupByName })(withRouter(AddGroup));
