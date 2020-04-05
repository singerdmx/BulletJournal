import React, { useEffect, useState } from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import {
  Carousel,
  Radio,
  DatePicker,
  Tooltip,
  Select,
  Button,
  Form,
  List
} from 'antd';
import { dateFormat } from '../../features/myBuJo/constants';
import './project.styles.less';
import { zones } from '../../components/settings/constants';
import { updateTransactions } from '../../features/transactions/actions';
import { updateExpandedMyself } from '../../features/myself/actions';
import {
  LedgerSummary,
} from '../../features/transactions/interface';
import TransactionItem from '../../components/project-item/transaction-item.component';
import './transaction.styles.less';
import LedgerSummaries from './ledger-summary';
import { TransactionsSummary } from '../../features/transactions/interface';

const { RangePicker } = DatePicker;
const { Option } = Select;
const currentZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const currentCountry = currentZone && currentZone.split('/')[0];
zones.sort((a, b) => {
  if (currentZone && currentZone === a) {
    return -1;
  }
  if (
    currentCountry &&
    a.includes(currentCountry) &&
    !b.includes(currentCountry)
  ) {
    return -1;
  }
  return 0;
});
const LedgerSummaryTypeMap = ['DEFAULT', 'PAYER', 'LABEL', 'TIMELINE'];

type TransactionProps = {
  projectId: number;
  timezone: string;
  ledgerSummary: LedgerSummary;

  updateExpandedMyself: (updateSettings: boolean) => void;
  updateTransactions: (
    projectId: number,
    timezone: string,
    frequencyType: string,
    ledgerSummaryType: string,
    startDate?: string,
    endDate?: string
  ) => void;
};

const TransactionProject: React.FC<TransactionProps> = props => {
  const [form] = Form.useForm();
  const [ledgerSummaryType, setLedgerSummaryType] = useState('DEFAULT');
  const {
    balance,
    income,
    expense,
    startDate,
    endDate,
    transactionsSummaries
  } = props.ledgerSummary;

  const updateTransactions = (
    values: any,
    currentLedgerSummaryType: string
  ) => {
    const startDate = values.date
      ? values.date[0].format(dateFormat)
      : undefined;
    const endDate = values.date ? values.date[1].format(dateFormat) : undefined;

    props.updateTransactions(
      props.projectId,
      values.timezone,
      values.frequencyType,
      currentLedgerSummaryType,
      startDate,
      endDate
    );
  };

  useEffect(() => {
    props.updateExpandedMyself(true);
    props.updateTransactions(
      props.projectId,
      currentZone,
      'MONTHLY',
      ledgerSummaryType,
      '',
      ''
    );
  }, []);

  const { transactions = [] } = props.ledgerSummary;

  return (
    <div className='transaction-page'>
      <div className='transaction-display'>
        <Carousel
          dotPosition='top'
          afterChange={(current: number) => {
            setLedgerSummaryType(LedgerSummaryTypeMap[current]);
            form
              .validateFields()
              .then(values => {
                updateTransactions(values, LedgerSummaryTypeMap[current]);
              })
              .catch(info => console.log(info));
          }}
        >
          <div className='transaction-summary'>
            <LedgerSummaries
              title={''}
              balance={balance}
              income={income}
              expense={expense}
              startDate={startDate}
              endDate={endDate}
            />
            {transactionsSummaries
              ? transactionsSummaries.map(
                  (transactionsSummary: TransactionsSummary, index: number) => (
                    <div>
                      <span>{transactionsSummary.name}</span>&nbsp;&nbsp;
                      <span>balance: {transactionsSummary.balance}</span>
                      &nbsp;&nbsp;
                      <span>
                        expense: {transactionsSummary.expense}&nbsp;&nbsp;
                        {transactionsSummary.expensePercentage}%,
                      </span>
                      &nbsp;&nbsp;
                      <span>income: {transactionsSummary.income}</span>
                      &nbsp;&nbsp;
                      {transactionsSummary.incomePercentage}%
                      <span>&nbsp;&nbsp;</span>
                    </div>
                  )
                )
              : 'Loading...'}
          </div>
          <div className='transaction-static'>
            <LedgerSummaries
              title={'By Payer'}
              balance={balance}
              income={income}
              expense={expense}
              startDate={startDate}
              endDate={endDate}
            />
            {transactionsSummaries
              ? transactionsSummaries.map(
                  (transactionsSummary: TransactionsSummary, index: number) => (
                    <div>
                      <span>{transactionsSummary.name}</span>&nbsp;&nbsp;
                      <span>balance: {transactionsSummary.balance}</span>
                      &nbsp;&nbsp;
                      <span>
                        expense: {transactionsSummary.expense}&nbsp;&nbsp;
                        {transactionsSummary.expensePercentage}%,
                      </span>
                      &nbsp;&nbsp;
                      <span>income: {transactionsSummary.income}</span>
                      &nbsp;&nbsp;
                      {transactionsSummary.incomePercentage}%
                      <span>&nbsp;&nbsp;</span>
                    </div>
                  )
                )
              : 'Loading...'}
          </div>
          <div className='transaction-static'>
            <LedgerSummaries
              title={'By Label'}
              balance={balance}
              income={income}
              expense={expense}
              startDate={startDate}
              endDate={endDate}
            />
            {transactionsSummaries
              ? transactionsSummaries.map(
                  (transactionsSummary: TransactionsSummary, index: number) => (
                    <div>
                      <span>{transactionsSummary.name}</span>&nbsp;&nbsp;
                      <span>balance: {transactionsSummary.balance}</span>
                      &nbsp;&nbsp;
                      <span>
                        expense: {transactionsSummary.expense}&nbsp;&nbsp;
                        {transactionsSummary.expensePercentage}%,
                      </span>
                      &nbsp;&nbsp;
                      <span>income: {transactionsSummary.income}</span>
                      &nbsp;&nbsp;
                      {transactionsSummary.incomePercentage}%
                      <span>&nbsp;&nbsp;</span>
                    </div>
                  )
                )
              : 'Loading...'}
          </div>
          <div className='transaction-static'>
            <LedgerSummaries
              title={'Timeline'}
              balance={balance}
              income={income}
              expense={expense}
              startDate={startDate}
              endDate={endDate}
            />
            {transactionsSummaries
              ? transactionsSummaries.map(
                  (transactionsSummary: TransactionsSummary, index: number) => (
                    <div>
                      <span>{transactionsSummary.name}</span>&nbsp;&nbsp;
                      <span>balance: {transactionsSummary.balance}</span>
                      &nbsp;&nbsp;
                      <span>
                        expense: {transactionsSummary.expense}&nbsp;&nbsp;
                        {transactionsSummary.expensePercentage}%,
                      </span>
                      &nbsp;&nbsp;
                      <span>income: {transactionsSummary.income}</span>
                      &nbsp;&nbsp;
                      {transactionsSummary.incomePercentage}%
                      <span>&nbsp;&nbsp;</span>
                    </div>
                  )
                )
              : 'Loading...'}
          </div>
          {/* maybe others? */}
        </Carousel>
      </div>
      <div className='transaction-control'>
        <Form
          form={form}
          initialValues={{
            frequencyType: 'MONTHLY',
            timezone: props.timezone ? props.timezone : currentZone
          }}
        >
          <Form.Item name='frequencyType'>
            <Radio.Group value='YEARLY'>
              <Radio value='WEEKLY'>WEEKLY</Radio>
              <Radio value='MONTHLY'>MONTHLY</Radio>
              <Radio value='YEARLY'>YEARLY</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name='date'>
            <RangePicker
              allowClear={true}
              format={dateFormat}
              placeholder={['Start Date', 'End Date']}
            />
          </Form.Item>

          <Form.Item name='timezone'>
            <Select
              style={{ width: '200px' }}
              showSearch={true}
              placeholder='Select Time Zone'
            >
              {zones.map((zone: string, index: number) => (
                <Option key={zone} value={zone}>
                  <Tooltip title={zone} placement='right'>
                    {<span>{zone}</span>}
                  </Tooltip>
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Tooltip title={"Click to Refresh Transactions"}>
            <Button
              onClick={() => {
                form
                  .validateFields()
                  .then(values => {
                    console.log(values);
                    updateTransactions(values, ledgerSummaryType);
                  })
                  .catch(info => console.log(info));
              }}
            >

                <span>Refresh</span>
            </Button>
          </Tooltip>
        </Form>
      </div>
      <List className='transaction-list'>
        {transactions.map(item => (
          <List.Item>
            <TransactionItem transaction={item} />
          </List.Item>
        ))}
      </List>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  projectId: state.project.project.id,
  timezone: state.settings.timezone,
  ledgerSummary: state.transaction.ledgerSummary
});

export default connect(mapStateToProps, {
  updateTransactions,
  updateExpandedMyself
})(TransactionProject);
