import React from 'react';
import {connect} from 'react-redux';
import {Avatar} from 'antd';
import {
  deleteTransaction
} from '../../features/transactions/actions';
import {Transaction} from '../../features/transactions/interface';

type TransactionProps = {
  transaction: Transaction;
  deleteTransaction: (transactionId: number) => void;
};

const TransactionItem: React.FC<TransactionProps> = props => {
  const {transaction} = props;

  return <div>
    <span><Avatar size='small' src={transaction.ownerAvatar}/></span>
    <div>{transaction.owner}</div>
    <span><Avatar size='small' src={transaction.payerAvatar}/></span>
    <div>{transaction.payer}</div>
  </div>;
};

export default connect(null, {
  deleteTransaction
})(TransactionItem);
