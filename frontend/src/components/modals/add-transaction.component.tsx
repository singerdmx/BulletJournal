import React from 'react';
import { Modal, Input, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps} from 'react-router';
import { createTransaction } from '../../features/transactions/actions';
import { IState } from '../../store';
import './modals.styles.less';

type TransactionProps = {
    projectId: number,
    createTransaction: (projectId: number, amount: number, name: string, payer: string,
      date: string, time: string, transactionType: number) => void;
};

type ModalState = {
  isShow: boolean;
  transactionName: string;
};

class AddTransaction extends React.Component<TransactionProps & RouteComponentProps, ModalState> {
  state: ModalState = {
    isShow: false,
    transactionName: ''
  };

  showModal = () => {
    this.setState({ isShow: true });
  };

  addTransaction = () => {
    // this.props.createTassk(this.props.projectId, this.state.taskName);
    this.setState({ isShow: false });
    this.props.history.push("/transactions")
  };

  onCancel = () => {
    this.setState({ isShow: false });
  };
  
  render() {
    return (
      <div className="add-transaction" title='Create New Transaction'>
        <PlusOutlined style={{ fontSize: 20, cursor: 'pointer' }} onClick={this.showModal} title='Create New Transaction' />
        <Modal
          title="Create New Transaction"
          visible={this.state.isShow}
          onCancel={this.onCancel}
          onOk={() => this.addTransaction}
          footer={[
            <Button key="cancel" onClick={this.onCancel}>
              Cancel
            </Button>,
            <Button key="create" type="primary" onClick={this.addTransaction}>
              Create
            </Button>
          ]}
        >
          <Input
            placeholder="Enter Transaction Name"
            onChange={e => this.setState({ transactionName: e.target.value })}
            onPressEnter={this.addTransaction}
            allowClear
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
    projectId: state.project.project.id
  });

export default connect(mapStateToProps, { createTransaction })(withRouter(AddTransaction));