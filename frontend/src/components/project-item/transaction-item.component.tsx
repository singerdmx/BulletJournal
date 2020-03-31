import React from 'react';
import { connect } from 'react-redux';
import {
  DeleteTwoTone,
  TagOutlined,
  MoreOutlined,
  SnippetsOutlined
} from '@ant-design/icons';
import { Popconfirm, Popover, Tag, Tooltip, Avatar, List } from 'antd';

import { Transaction } from '../../features/transactions/interface';
import { icons } from '../../assets/icons';

type TransactionProps = {
  transaction: Transaction;
};

const TransactionItem: React.FC<TransactionProps> = props => {
  const { transaction } = props;

  return <div>{transaction.owner}</div>;
};

export default connect(null, {})(TransactionItem);
