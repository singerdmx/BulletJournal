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

type TransationProps = {
    transaction: Transaction;
};

const TransactionItem: React.FC<TransationProps> = props => {
  const { transaction } = props;

  return (
    <List.Item style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <div>{transaction.owner}</div>
    </List.Item>
  );
};

export default connect(null, { })(TransactionItem);