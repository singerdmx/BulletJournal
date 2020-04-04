// react imports
import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
// features
import { getTransaction } from '../../features/transactions/actions';
import { Transaction } from '../../features/transactions/interface';
import { stringToRGB, Label } from '../../features/label/interface';
import { addSelectedLabel } from '../../features/label/actions';
import { IState } from '../../store';
// components

// antd imports
import { Tooltip, Tag, Avatar, Divider, Button, Popconfirm } from 'antd';
import {
  TagOutlined,
  DeleteTwoTone,
  PlusCircleTwoTone
} from '@ant-design/icons';

import { icons } from '../../assets/icons/index';
import './transaction-page.styles.less';
import 'braft-editor/dist/index.css';

type TransactionProps = {
  currency: string;
  transaction: Transaction;
  deleteTransaction: (transactionId: number) => void;
};

interface TransactionPageHandler {
  getTransaction: (transactionId: number) => void;
  addSelectedLabel: (label: Label) => void;
}

// get icons by string name
const getIcon = (icon: string) => {
  let res = icons.filter(item => item.name === icon);
  return res.length > 0 ? res[0].icon : <TagOutlined />;
};

const TransactionPage: React.FC<TransactionPageHandler &
  TransactionProps> = props => {
  const { transaction, deleteTransaction } = props;
  // get id of Transaction from oruter
  const { transactionId } = useParams();
  // state control drawer displaying
  const [showEditor, setEditorShow] = useState(false);
  // hook history in router
  const history = useHistory();
  // jump to label searching page by label click
  const toLabelSearching = (label: Label) => {
    console.log(label);
    props.addSelectedLabel(label);
    history.push('/labels/search');
  };
  // listening on the empty state working as componentDidmount
  React.useEffect(() => {
    transactionId && props.getTransaction(parseInt(transactionId));
  }, [transactionId]);
  // show drawer
  const createHandler = () => {
    setEditorShow(true);
  };

  return (
    <div className='tran-page'>
      <Tooltip
        placement='top'
        title={transaction.owner}
        className='transaction-avatar'
      >
        <span>
          <Avatar size='large' src={transaction.ownerAvatar} />
        </span>
      </Tooltip>
      <div className='transaction-title'>
        <div className='label-and-name'>
          {transaction.name}
          <div className='transaction-labels'>
            {transaction.labels &&
              transaction.labels.map((label, index) => {
                return (
                  <Tag
                    key={index}
                    className='labels'
                    color={stringToRGB(label.value)}
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                  >
                    <span onClick={() => toLabelSearching(label)}>
                      {getIcon(label.icon)} &nbsp;
                      {label.value}
                    </span>
                  </Tag>
                );
              })}
          </div>
        </div>

        <div className='transaction-operation'>
          <Tooltip title='Manage Labels'>
            <TagOutlined />
          </Tooltip>
        </div>
      </div>
      <Divider />
      <div className='content'>
        <div className='content-list'></div>
        <Button onClick={createHandler}>
          <PlusCircleTwoTone />
          New
        </Button>
      </div>
      <div className='transaction-drawer'></div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  transaction: state.transaction.transaction,
  currency: state.myself.currency,
});

export default connect(mapStateToProps, {
  getTransaction,
  addSelectedLabel
})(TransactionPage);
