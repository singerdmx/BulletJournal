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
import Item from 'antd/lib/list/Item';

type TransactionProps = {
    transaction: Transaction;
};

const TransactionItem: React.FC<TransactionProps> = props => {
  const { transaction } = props;

  return (
    <List.Item style={{ display: 'flex', width: '100%' }}>
        <span><Avatar size='small' src={transaction.ownerAvatar}/></span>
        <div>{transaction.owner}</div>
        <span><Avatar size='small' src={transaction.payerAvatar}/></span>
        <div>{transaction.payer}</div>
    </List.Item>
  );
};

export default connect(null, { })(TransactionItem);