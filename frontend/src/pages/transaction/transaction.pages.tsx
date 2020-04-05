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
import { ProjectType } from '../../features/project/constants';
import { deleteTransaction } from '../../features/transactions/actions';
import { dateFormat } from '../../features/myBuJo/constants';
// modals import
import EditTransaction from '../../components/modals/edit-transaction.component';
import MoveProjectItem from '../../components/modals/move-project-item.component';

// antd imports
import {
  Tooltip,
  Tag,
  Avatar,
  Divider,
  Button,
  Popconfirm,
  Card,
  Row,
  Col,
  Statistic,
} from 'antd';
import {
  TagOutlined,
  DeleteTwoTone,
  PlusCircleTwoTone,
  AccountBookOutlined,
  DollarCircleOutlined,
  UpSquareOutlined
} from '@ant-design/icons';
import moment from 'moment';

import { icons } from '../../assets/icons/index';
import './transaction-page.styles.less';
import 'braft-editor/dist/index.css';

const LocaleCurrency = require('locale-currency');

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
  let res = icons.filter((item) => item.name === icon);
  return res.length > 0 ? res[0].icon : <TagOutlined />;
};

const TransactionPage: React.FC<TransactionPageHandler & TransactionProps> = (
  props
) => {
  const { transaction, deleteTransaction, currency } = props;

  // get id of Transaction from oruter
  const { transactionId } = useParams();
  // state control drawer displaying
  const [showEditor, setEditorShow] = useState(false);
  const currencyType = LocaleCurrency.getCurrency(currency);
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

  const getPaymentDateTime = (transaction: Transaction) => {
    if (!transaction.date) {
      return null;
    }

    return (
      <Col span={12}>
        <Card>
          <Statistic
            title={moment(transaction.date, dateFormat).fromNow()}
            value={`${transaction.date} ${
              transaction.time ? transaction.time : ''
            }`}
            prefix={<AccountBookOutlined />}
          />
        </Card>
      </Col>
    );
  };

  return (
    <div className='tran-page'>
      <Tooltip
        placement='top'
        title={`Payer ${transaction.payer}`}
        className='transaction-avatar'
      >
        <span>
          <Avatar size='large' src={transaction.payerAvatar} />
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
          <Tooltip title={`Created by ${transaction.owner}`}>
            <div className='transaction-owner'>
              <Avatar src={transaction.ownerAvatar} />
            </div>
          </Tooltip>
          <Tooltip title='Manage Labels'>
            <div>
              <TagOutlined />
            </div>
          </Tooltip>
          <MoveProjectItem
            type={ProjectType.LEDGER}
            projectItemId={transaction.id}
            mode='icon'
          />
          <Tooltip title='Delete'>
            <Popconfirm
              title='Are you sure?'
              okText='Yes'
              cancelText='No'
              onConfirm={() => {
                deleteTransaction(transaction.id);
                history.goBack();
              }}
              className='group-setting'
              placement='bottom'
            >
              <div>
                <DeleteTwoTone twoToneColor='#f5222d' />
              </div>
            </Popconfirm>
          </Tooltip>
          <Tooltip title='Go to Parent BuJo'>
            <div>
              <UpSquareOutlined onClick={e => history.push(`/projects/${transaction.projectId}`)}/>
            </div>
          </Tooltip>
        </div>
      </div>
      <Divider />
      <div className='transaction-statistic-card'>
        <Row gutter={10}>
          {getPaymentDateTime(transaction)}
          <Col span={12}>
            <Card>
              <Statistic
                title={
                  (transaction.transactionType === 0 ? 'Income' : 'Expense') +
                  ` ${currencyType ? `(${currencyType})` : ''}`
                }
                value={transaction.amount + transaction.transactionType}
                prefix={<DollarCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
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
  deleteTransaction,
  addSelectedLabel,
})(TransactionPage);
