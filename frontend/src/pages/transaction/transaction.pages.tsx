// react imports
import React, { useEffect, useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
// features
import { Transaction } from '../../features/transactions/interface';
import { IState } from '../../store';
import {
  ProjectItemUIType,
  ProjectType,
} from '../../features/project/constants';
import {
  deleteTransaction, deleteContent,
  getTransaction,
  updateTransactionContents,
} from '../../features/transactions/actions';
import { dateFormat } from '../../features/myBuJo/constants';
// modals import
import EditTransaction from '../../components/modals/edit-transaction.component';
import MoveProjectItem from '../../components/modals/move-project-item.component';
// antd imports
import {
  Avatar,
  BackTop,
  Card,
  Col,
  Divider, message,
  Popconfirm,
  Row,
  Statistic,
  Tooltip,
} from 'antd';
import {
  CreditCardOutlined,
  DeleteTwoTone,
  DollarCircleOutlined,
  SyncOutlined,
  UpSquareOutlined,
  PlusOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import DraggableLabelsList from '../../components/draggable-labels/draggable-label-list.component';
import TransactionContentList from '../../components/content/content-list.component';
import { Content } from '../../features/myBuJo/interface';
import './transaction-page.styles.less';
import 'braft-editor/dist/index.css';
import ContentEditorDrawer from '../../components/content-editor/content-editor-drawer.component';
import LabelManagement from '../project/label-management.compoent';
import {
  Container,
  Button as FloatButton,
  lightColors,
  darkColors,
} from 'react-floating-action-button';
import { setDisplayMore, setDisplayRevision } from "../../features/content/actions";
import {CopyOutlined, DeleteOutlined, EditOutlined, HighlightOutlined} from "@ant-design/icons/lib";
import {animation, IconFont, Item, Menu, MenuProvider} from "react-contexify";
import {theme as ContextMenuTheme} from "react-contexify/lib/utils/styles";
import CopyToClipboard from "react-copy-to-clipboard";
import {getProject} from "../../features/project/actions";
import {Project} from "../../features/project/interface";
import {contentEditable} from "../note/note.pages";

const LocaleCurrency = require('locale-currency');

type TransactionProps = {
  myself: string;
  project: Project | undefined;
  currency: string;
  transaction: Transaction | undefined;
  contents: Content[];
  deleteTransaction: (transactionId: number, type: ProjectItemUIType) => void;
  updateTransactionContents: (transactionId: number, updateDisplayMore?: boolean) => void;
  getProject: (projectId: number) => void;
};

interface TransactionPageHandler {
  theme: string;
  content: Content | undefined;
  getTransaction: (transactionId: number) => void;
  setDisplayMore: (displayMore: boolean) => void;
  setDisplayRevision: (displayRevision: boolean) => void;
  deleteContent: (taskId: number, contentId: number) => void;
}

const TransactionPage: React.FC<TransactionPageHandler & TransactionProps> = (
  props
) => {
  const {
    myself,
    project,
    theme,
    content,
    transaction,
    deleteTransaction,
    currency,
    contents,
    updateTransactionContents,
    getTransaction,
    setDisplayMore,
    setDisplayRevision,
    deleteContent,
    getProject
  } = props;

  // get id of Transaction from router
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
    if (!transaction) {
      return;
    }
    document.title = transaction.name;
    transaction.id && updateTransactionContents(transaction.id);
    setDisplayMore(false);
    setDisplayRevision(false);
    getProject(transaction.projectId);
  }, [transaction]);

  if (!transaction) return null;
  // show drawer
  const createHandler = () => {
    setEditorShow(true);
  };

  const handleClose = () => {
    setEditorShow(false);
  };

  const handleEdit = () => {
    transaction && transaction.id && updateTransactionContents(transaction.id, true);
  };

  const handleOpenRevisions = () => {
    setDisplayRevision(true);
  };

  const handleDelete = () => {
    if (!content) {
      return;
    }
    deleteContent(transaction.id, content.id);
  };

  const handleRefresh = () => {
    transaction && transaction.id && updateTransactionContents(transaction.id);
    transactionId && getTransaction(parseInt(transactionId));
  };

  const createContentElem = (
    <Container>
      <FloatButton
          tooltip="Go to Parent BuJo"
          onClick={() => history.push(`/projects/${transaction.projectId}`)}
          styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
      >
        <UpSquareOutlined/>
      </FloatButton>
      <FloatButton
          tooltip="Refresh Contents"
          onClick={handleRefresh}
          styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
      >
        <SyncOutlined/>
      </FloatButton>
      {contentEditable(myself, content, transaction, project) && <FloatButton
        tooltip="Delete Content"
        onClick={handleDelete}
        styles={{ backgroundColor: darkColors.grey, color: lightColors.white }}
      >
        <DeleteOutlined />
      </FloatButton>}
      {content && content.revisions.length > 1 && contentEditable(myself, content, transaction, project) && <FloatButton
        tooltip={`View Revision History (${content.revisions.length - 1})`}
        onClick={handleOpenRevisions}
        styles={{ backgroundColor: darkColors.grey, color: lightColors.white }}
      >
        <HighlightOutlined />
      </FloatButton>}
      {contentEditable(myself, content, transaction, project) && <FloatButton
        tooltip="Edit Content"
        onClick={handleEdit}
        styles={{ backgroundColor: darkColors.grey, color: lightColors.white }}
      >
        <EditOutlined />
      </FloatButton>}
      <FloatButton
        tooltip="Add Content"
        onClick={createHandler}
        styles={{ backgroundColor: darkColors.grey, color: lightColors.white }}
      >
        <PlusOutlined />
      </FloatButton>
    </Container>

  );

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
            prefix={<CreditCardOutlined />}
          />
        </Card>
      </Col>
    );
  };

  const labelEditableHandler = () => {
    setLabelEditable((labelEditable) => !labelEditable);
  };

  return (
    <div className="tran-page">
      <BackTop />

      <Tooltip
        placement="top"
        title={`Payer ${transaction.payer.alias}`}
        className="transaction-avatar"
      >
        <span>
          <Avatar size="large" src={transaction.payer.avatar} />
        </span>
      </Tooltip>
      <div className="transaction-title">
        <div className="label-and-name">
          <>
            <MenuProvider id={`transaction${transaction.id}`}>
              <span>{transaction.name}</span>
            </MenuProvider>

            <Menu id={`transaction${transaction.id}`}
                  theme={theme === 'DARK' ? ContextMenuTheme.dark : ContextMenuTheme.light}
                  animation={animation.zoom}>
              <CopyToClipboard
                  text={`${transaction.name} ${window.location.origin.toString()}/#/transaction/${transaction.id}`}
                  onCopy={() => message.success('Link Copied to Clipboard')}
              >
                <Item>
                  <IconFont style={{fontSize: '14px', paddingRight: '6px'}}><CopyOutlined/></IconFont>
                  <span>Copy Link Address</span>
                </Item>
              </CopyToClipboard>
            </Menu>
          </>
          <DraggableLabelsList
            mode={ProjectType.LEDGER}
            labels={transaction.labels}
            editable={labelEditable}
            itemId={transaction.id}
            itemShared={transaction.shared}
          />
        </div>
        <div className="transaction-operation">
          <Tooltip title={`Created by ${transaction.owner.alias}`}>
            <div className="transaction-owner">
              <Avatar src={transaction.owner.avatar} />
            </div>
          </Tooltip>
          <LabelManagement
            labelEditableHandler={labelEditableHandler}
            labelEditable={labelEditable}
          />
          <MoveProjectItem
            type={ProjectType.LEDGER}
            projectItemId={transaction.id}
            mode="icon"
          />
          <EditTransaction transaction={transaction} mode="icon" />
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                deleteTransaction(transaction.id, ProjectItemUIType.PAGE);
                history.goBack();
              }}
              className="group-setting"
              placement="bottom"
            >
              <div>
                <DeleteTwoTone twoToneColor="#f5222d" />
              </div>
            </Popconfirm>
          </Tooltip>
        </div>
      </div>
      <Divider />
      <div className="transaction-statistic-card">
        <Row gutter={10}>
          {getPaymentDateTime(transaction)}
          <Col span={12}>
            <Card>
              <Statistic
                title={
                  (transaction.transactionType === 0 ? 'Income' : 'Expense') +
                  ` ${currencyType ? `(${currencyType})` : ''}`
                }
                value={transaction.amount}
                prefix={<DollarCircleOutlined />}
              />
            </Card>
          </Col>
        </Row>
      </div>
      <Divider />
      <div className="tran-content">
        <div className="content-list">
          <TransactionContentList
            projectItem={transaction}
            contents={contents}
          />
        </div>
        {createContentElem}
      </div>
      <div className="transaction-drawer">
        <ContentEditorDrawer
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
  content: state.content.content,
  theme: state.myself.theme,
  myself: state.myself.username,
  project: state.project.project
});

export default connect(mapStateToProps, {
  getTransaction,
  deleteTransaction,
  updateTransactionContents,
  deleteContent,
  setDisplayMore,
  setDisplayRevision,
  getProject
})(TransactionPage);
