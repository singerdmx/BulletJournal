import React from 'react';
import { Modal, Empty } from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './modals.styles.less';
import TransactionItem from '../project-item/transaction-item.component';
import { Transaction } from '../../features/transactions/interface';
import { User } from '../../features/group/interface';

type TransactionsByPayerProps = {
  transactionsByPayer: Transaction[];
  visible: boolean;
  payer: User | undefined;
  onCancel: () => void;
};

const TransactionsByPayer: React.FC<TransactionsByPayerProps> = (props) => {
  const { visible, payer, transactionsByPayer } = props;
  return (
    <Modal
      title={`Paid by ${payer ? payer.alias : ''}`}
      visible={visible}
      onCancel={props.onCancel}
      footer={false}
    >
      {transactionsByPayer.length === 0 ? (
        <Empty />
      ) : (
        transactionsByPayer.map((transaction, index) => {
          return (
            <div key={index}>
              <TransactionItem
                transaction={transaction}
                inModal={true}
                inProject={false}
              />
            </div>
          );
        })
      )}
    </Modal>
  );
};

const mapStateToProps = (state: IState) => ({
  transactionsByPayer: state.transaction.transactionsByPayer,
});

export default connect(mapStateToProps, {})(TransactionsByPayer);
