// react imports
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
// features
import { Transaction } from '../../features/transactions/interface';
import { IState } from '../../store';
import { ProjectItemUIType, ProjectType } from '../../features/project/constants';
import { deleteTransaction, getTransaction, updateTransactionContents, } from '../../features/transactions/actions';
import { dateFormat } from '../../features/myBuJo/constants';
// modals import
import EditTransaction from '../../components/modals/edit-transaction.component';
import MoveProjectItem from '../../components/modals/move-project-item.component';
// antd imports
import { Avatar, BackTop, Button, Card, Col, Divider, Popconfirm, Row, Statistic, Tooltip, } from 'antd';
import {
  AccountBookOutlined,
  DeleteTwoTone,
  DollarCircleOutlined,
  PlusCircleTwoTone,
  SyncOutlined,
  UpSquareOutlined,
  PlusOutlined
} from '@ant-design/icons';
import moment from 'moment';
import DraggableLabelsList from '../../components/draggable-labels/draggable-label-list.component';
import TransactionContentList from '../../components/content/content-list.component';
import { Content } from '../../features/myBuJo/interface';
import './transaction-page.styles.less';
import 'braft-editor/dist/index.css';
import ContentEditorDrawer from '../../components/content-editor/content-editor-drawer.component';
import LabelManagement from '../project/label-management.compoent';
import { Container, Button as FloatButton, lightColors, darkColors } from 'react-floating-action-button'


const LocaleCurrency = require('locale-currency');

type TransactionProps = {
  currency: string;
  transaction: Transaction | undefined;
  contents: Content[];
  deleteTransaction: (transactionId: number, type: ProjectItemUIType) => void;
  updateTransactionContents: (transactionId: number) => void;
};

interface TransactionPageHandler {
  getTransaction: (transactionId: number) => void;
}

const TransactionPage: React.FC<TransactionPageHandler & TransactionProps> = (
  props
) => {
  const {
    transaction,
    deleteTransaction,
    currency,
    contents,
    updateTransactionContents,
    getTransaction
  } = props;

  // get id of Transaction from oruter
  const { transactionId } = useParams();
  // state control drawer displaying
  const [showEditor, setEditorShow] = useState(false);
  const [labelEditable, setLabelEditable] = useState(false);
  const currencyType = LocaleCurrency.getCurrency(currency);
  // hook history in router
  const history = useHistory();

  // listening on the empty state working as componentDidmount
  useEffect(() => {
    transactionId && getTransaction(parseInt(transactionId));
  }, [transactionId]);

  useEffect(() => {
    transaction && transaction.id && updateTransactionContents(transaction.id);
    if (transaction) {
      document.title = transaction.name;
    }
  }, [transaction]);

  if (!transaction) return null;
  // show drawer
  const createHandler = () => {
    setEditorShow(true);
  };

  const handleClose = () => {
    setEditorShow(false);
  };

  const handleRefresh = () => {
    transaction && transaction.id && updateTransactionContents(transaction.id);
    transactionId && getTransaction(parseInt(transactionId));
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

  const labelEditableHandler = () => {
    setLabelEditable((labelEditable) => !labelEditable);
  };

  return (
    <div className='tran-page'>
      <BackTop />

      <Tooltip
        placement='top'
        title={`Payer ${transaction.payer.alias}`}
        className='transaction-avatar'
      >
        <span>
          <Avatar size='large' src={transaction.payer.avatar} />
        </span>
      </Tooltip>
      <div className='transaction-title'>
        <div className='label-and-name'>
          {transaction.name}
          <DraggableLabelsList
            mode={ProjectType.LEDGER}
            labels={transaction.labels}
            editable={labelEditable}
            itemId={transaction.id}
            itemShared={transaction.shared}
          />
        </div>
        <div className='transaction-operation'>
          <Tooltip title={`Created by ${transaction.owner.alias}`}>
            <div className='transaction-owner'>
              <Avatar src={transaction.owner.avatar} />
            </div>
          </Tooltip>
          <LabelManagement
            labelEditableHandler={labelEditableHandler}
            labelEditable={labelEditable}
          />
          <EditTransaction transaction={transaction} mode='icon' />
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
                deleteTransaction(transaction.id, ProjectItemUIType.PAGE);
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
          <Tooltip title='Refresh Contents'>
            <div>
              <SyncOutlined onClick={handleRefresh} />
            </div>
          </Tooltip>
          <Tooltip title='Go to Parent BuJo'>
            <div>
              <UpSquareOutlined
                onClick={(e) =>
                  history.push(`/projects/${transaction.projectId}`)
                }
              />
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
      <div className='tran-content'>
        <div className='content-list'>
          <TransactionContentList
            projectItem={transaction}
            contents={contents}
          />
        </div>
        <Container>
          <FloatButton
            tooltip="Add Content"
            onClick={createHandler}
            styles={{ backgroundColor: darkColors.grey, color: lightColors.white }}
          >
            <PlusOutlined />
          </FloatButton>
        </Container>
      </div>
      <div className='transaction-drawer'>
        <ContentEditorDrawer
          readMode={false}
          projectItem={transaction}
          visible={showEditor}
          onClose={handleClose}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  transaction: state.transaction.transaction,
  currency: state.myself.currency,
  contents: state.transaction.contents,
});

export default connect(mapStateToProps, {
  getTransaction,
  deleteTransaction,
  updateTransactionContents,
})(TransactionPage);
