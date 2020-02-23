import React from 'react';
import { Modal, Input } from 'antd';

type ModalState = {
  isShow: boolean;
};

type ModalProps = {
  groupId : number 
}

class AddUser extends React.Component<ModalProps ,ModalState> {
  state : ModalState ={
    isShow : false
  }

  showModal = () => {
    this.setState({isShow: true})
  }

  render() {
    return <Modal
    title="Add User"
    visible={this.state.isShow}
    onCancel={() => this.setState({ isShow: false })}
    onOk={() => this.setState({ isShow: false })}
  >
    <Input.Search allowClear />
  </Modal>
  }
}

export default AddUser;
