import React from 'react';
import { Modal, Input } from 'antd';

type ModalProps = {
  isShow: boolean;
};

class AddUser extends React.Component<ModalProps> {
  render() {
    return <Modal title="Create New Group" visible={this.props.isShow}>
        <Input.Search allowClear/>
    </Modal>;
  }
}

export default AddUser;
