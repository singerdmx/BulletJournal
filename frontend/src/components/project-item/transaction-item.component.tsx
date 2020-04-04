import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Avatar, Popconfirm, Popover, Tooltip, Tag } from 'antd';
import {
  DeleteTwoTone,
  TagOutlined,
  MoreOutlined,
  AccountBookOutlined,
  MoneyCollectOutlined,
} from '@ant-design/icons';
import { deleteTransaction } from '../../features/transactions/actions';
import { stringToRGB } from '../../features/label/interface';
import { Transaction } from '../../features/transactions/interface';
import './project-item.styles.less';
import { icons } from '../../assets/icons';
import moment from 'moment';
import { dateFormat } from '../../features/myBuJo/constants';
import { IState } from '../../store';
const LocaleCurrency = require('locale-currency'); //currency code

type TransactionProps = {
  currency: string;
  transaction: Transaction;
  deleteTransaction: (transactionId: number) => void;
};

type NoteManageProps = {};

const ManageNote: React.FC<NoteManageProps> = (props) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <Popconfirm
        title='Deleting Note also deletes its child notes. Are you sure?'
        okText='Yes'
        cancelText='No'
        className='group-setting'
        placement='bottom'
      >
        <div className='popover-control-item'>
          <span>Delete</span>
          <DeleteTwoTone twoToneColor='#f5222d' />
        </div>
      </Popconfirm>
    </div>
  );
};

const TransactionItem: React.FC<TransactionProps> = (props) => {
  const { transaction } = props;

  const getTransactionIcon = (transaction: Transaction) => {
    if (transaction.labels && transaction.labels[0]) {
      const icon = transaction.labels[0].icon;
      return getIcon(icon);
    }

    return <AccountBookOutlined />;
  };

  const getIcon = (icon: string) => {
    const res = icons.filter((item) => item.name === icon);
    return res.length > 0 ? res[0].icon : <TagOutlined />;
  };

  const getPaymentDateTime = () => {
    if (!transaction.date) {
      return null;
    }

    return (
      <Tooltip
        title={moment(transaction.date, dateFormat).fromNow()}
        placement={'bottom'}
      >
        <div className='project-item-time'>
          {transaction.date} {transaction.time}
        </div>
      </Tooltip>
    );
  };

  const getTransactionInfo = (transaction: Transaction) => {
    const amount = `${transaction.amount} ${props.currency ? LocaleCurrency.getCurrency(props.currency) : ''}`;
    switch (transaction.transactionType) {
      case 0:
        return (
          <Tooltip title={`Income ${amount}`}>
            <span className='transaction-item-income'>
              <MoneyCollectOutlined /> {transaction.amount}
            </span>
          </Tooltip>
        );
      case 1:
        return (
          <Tooltip title={`Expense ${amount}`}>
            <span className='transaction-item-expense'>
              <MoneyCollectOutlined /> {transaction.amount}
            </span>
          </Tooltip>
        );
    }

    return null;
  };

  return (
    <div className='project-item'>
      <div className='project-item-content'>
        <Link to={`/transaction/${transaction.id}`}>
          <h3 className='project-item-name'>
            {getTransactionIcon(transaction)}&nbsp;
            {transaction.name}
          </h3>
        </Link>
        <div className='project-item-subs'>
          <div className='project-item-labels'>
            {transaction.labels &&
              transaction.labels.map((label) => {
                return (
                  <Tag
                    key={`label${label.id}`}
                    className='labels'
                    color={stringToRGB(label.value)}
                  >
                    <span>
                      {getIcon(label.icon)} &nbsp;
                      {label.value}
                    </span>
                  </Tag>
                );
              })}
          </div>
          {getPaymentDateTime()}
        </div>
      </div>

      <div className='project-control'>
        <div className='project-item-owner'>
          <Tooltip title={`Created by ${transaction.owner}`}>
            <Avatar src={transaction.ownerAvatar} size='small' />
          </Tooltip>
        </div>
        <div className='project-item-owner'>
          <Tooltip title={`Payer ${transaction.payer}`}>
            <Avatar src={transaction.payerAvatar} size='small' />
          </Tooltip>
        </div>
        <div className='project-item-owner'>
          {getTransactionInfo(transaction)}
        </div>
        <Popover
          arrowPointAtCenter
          placement='rightTop'
          overlayStyle={{ width: '150px' }}
          content={<ManageNote />}
          trigger='click'
        >
          <span className='project-control-more'>
            <MoreOutlined />
          </span>
        </Popover>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  currency: state.myself.currency,
});

export default connect(mapStateToProps, {
  deleteTransaction,
})(TransactionItem);
