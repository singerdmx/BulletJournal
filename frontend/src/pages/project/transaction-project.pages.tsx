import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Tooltip as HoverHint, LineChart } from 'recharts';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Carousel, Radio, DatePicker, Tooltip, Select, Form, List } from 'antd';
import moment from 'moment';
import { dateFormat } from '../../features/myBuJo/constants';
import './project.styles.less';
import { zones } from '../../components/settings/constants';
import { updateTransactions } from '../../features/transactions/actions';
import { updateExpandedMyself } from '../../features/myself/actions';
import { LedgerSummary } from '../../features/transactions/interface';
import TransactionItem from '../../components/project-item/transaction-item.component';
import './transaction.styles.less';
import LedgerSummaries from '../../components/ledger-summary/ledger-summary';
import { TransactionsSummary } from '../../features/transactions/interface';
import { RadioChangeEvent } from 'antd/lib/radio';

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
const LedgerSummaryTypeMap = ['DEFAULT', 'PAYER', 'LABEL'];

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

const TransactionProject: React.FC<TransactionProps> = (props) => {
  const [form] = Form.useForm();
  const [ledgerSummaryType, setLedgerSummaryType] = useState('DEFAULT');
  //used for LABEL pie
  const [labelExpenseData, setLabelExpenseData] = useState([{}]);
  const [labelIncomeData, setLabelIncomeData] = useState([{}]);
  const [graphCate, setGraphCate] = useState('');
  const [showLabelExpenseTab, setShowLabelExpenseTab] = useState(false);
  const [showLabelIncomeTab, setShowLabelIncomeTab] = useState(false);
  //used for PAYER pie
  const [payerExpenseData, setPayerExpenseData] = useState([{}]);
  const [payerIncomeData, setPayerIncomeData] = useState([{}]);
  const [showPayerExpenseTab, setShowPayerExpenseTab] = useState(false);
  const [showPayerIncomeTab, setShowPayerIncomeTab] = useState(false);
  const {
    balance,
    income,
    expense,
    startDate,
    endDate,
    transactionsSummaries,
  } = props.ledgerSummary;
  const { transactions = [] } = props.ledgerSummary;

  const updateTransactions = (
    values: any,
    currentLedgerSummaryType: string
  ) => {
    //reset tab to false when refresh
    setShowLabelExpenseTab(false);
    setShowLabelIncomeTab(false);
    setShowPayerExpenseTab(false);
    setShowPayerIncomeTab(false);

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

  useEffect(() => {
    if (ledgerSummaryType === 'LABEL') {
      const newExpenseData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showLabelExpenseTab && transaction.expense !== 0) {
            setShowLabelExpenseTab(true);
            setGraphCate('expense');
          }
          return { name: transaction.name, expense: transaction.expense };
        }
      );
      setLabelExpenseData(newExpenseData);
      const newIncomeData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showLabelIncomeTab && transaction.income !== 0) {
            setShowLabelIncomeTab(true);
            setGraphCate('income');
          }
          return { name: transaction.name, income: transaction.income };
        }
      );
      setLabelIncomeData(newIncomeData);
    } else if (ledgerSummaryType === 'PAYER') {
      const newExpenseData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showPayerExpenseTab && transaction.expense !== 0) {
            setShowPayerExpenseTab(true);
            setGraphCate('expense');
          }
          return { name: transaction.name, expense: transaction.expense };
        }
      );
      setPayerExpenseData(newExpenseData);
      const newIncomeData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showPayerIncomeTab && transaction.income !== 0) {
            setShowPayerIncomeTab(true);
            setGraphCate('income');
          }
          return { name: transaction.name, income: transaction.income };
        }
      );
      setPayerIncomeData(newIncomeData);
    } else {
      setLabelExpenseData([]);
      setLabelIncomeData([]);
      setShowLabelExpenseTab(false);
      setShowLabelIncomeTab(false);
      setPayerExpenseData([]);
      setPayerIncomeData([]);
      setShowPayerExpenseTab(false);
      setShowPayerIncomeTab(false);
    }
  }, [props.ledgerSummary]);

  const getDefault = () => {
    return (
      <LedgerSummaries
        title={''}
        balance={balance}
        income={income}
        expense={expense}
        startDate={startDate}
        endDate={endDate}
      >
        {' '}
        {transactionsSummaries
          ? transactionsSummaries.map(
              (transactionsSummary: TransactionsSummary, index: number) => (
                <div>
                  <span>{transactionsSummary.name}</span>
                  <span>balance: {transactionsSummary.balance}</span>
                  <span>
                    expense: {transactionsSummary.expense}&nbsp;&nbsp;
                    {transactionsSummary.expensePercentage}%,
                  </span>
                  <span>income: {transactionsSummary.income}</span>
                  {transactionsSummary.incomePercentage}%
                </div>
              )
            )
          : 'Loading...'}
      </LedgerSummaries>
    );
  };

  const getPayer = () => {
    return (
      <LedgerSummaries
        title={'By Payer'}
        balance={balance}
        income={income}
        expense={expense}
        startDate={startDate}
        endDate={endDate}
      >
        {transactionsSummaries
          ? transactionsSummaries.map(
              (transactionsSummary: TransactionsSummary, index: number) => (
                <div>
                  <span>{transactionsSummary.name}</span>
                  <span>balance: {transactionsSummary.balance}</span>
                  <span>
                    expense: {transactionsSummary.expense}&nbsp;&nbsp;
                    {transactionsSummary.expensePercentage}%,
                  </span>
                  <span>income: {transactionsSummary.income}</span>
                  {transactionsSummary.incomePercentage}%
                </div>
              )
            )
          : 'Loading...'}{' '}
      </LedgerSummaries>
    );
  };

  const getLabel = () => {
    return (
      <LedgerSummaries
        title={'By Label'}
        balance={balance}
        income={income}
        expense={expense}
        startDate={startDate}
        endDate={endDate}
      >
        {' '}
        {transactionsSummaries
          ? transactionsSummaries.map(
              (transactionsSummary: TransactionsSummary, index: number) => (
                <div>
                  <span>{transactionsSummary.name}</span>&nbsp;&nbsp;
                  <span>balance: {transactionsSummary.balance}</span>
                  <span>
                    expense: {transactionsSummary.expense}&nbsp;&nbsp;
                    {transactionsSummary.expensePercentage}%,
                  </span>
                  <span>income: {transactionsSummary.income}</span>
                  {transactionsSummary.incomePercentage}%
                </div>
              )
            )
          : 'Loading...'}
      </LedgerSummaries>
    );
  };

  const handleFilterChange = (changed: any, allValue: any) => {
    form
      .validateFields()
      .then((values) => updateTransactions(values, ledgerSummaryType))
      .catch((info) => console.log(info));
  };

  return (
    <div className="transaction-page">
      <div className="transaction-control">
        <Form
          form={form}
          onValuesChange={handleFilterChange}
          layout="inline"
          initialValues={{
            frequencyType: 'MONTHLY',
            timezone: props.timezone ? props.timezone : currentZone,
          }}
        >
          <Form.Item name="frequencyType">
            <Radio.Group value="YEARLY" size="small" buttonStyle="solid">
              <Tooltip title='WEEKLY'>
                <Radio.Button value="WEEKLY">W</Radio.Button>
              </Tooltip>
              <Tooltip title='MONTHLY'>
                <Radio.Button value="MONTHLY">M</Radio.Button>
              </Tooltip>
              <Tooltip title='YEARLY'>
                <Radio.Button value="YEARLY">Y</Radio.Button>
              </Tooltip>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="date">
            <RangePicker
              ranges={{
                Today: [moment(), moment()],
                'This Week': [moment().startOf('week'), moment().endOf('week')],
                'This Month': [
                  moment().startOf('month'),
                  moment().endOf('month'),
                ],
              }}
              size="small"
              allowClear={true}
              format={dateFormat}
              placeholder={['Start Date', 'End Date']}
            />
          </Form.Item>

          <Tooltip title='Time Zone'>
          <Form.Item name="timezone">
            <Select
              size="small"
              style={{ maxWidth: 100 }}
              dropdownMatchSelectWidth={200}
              showSearch={true}
              placeholder="Select Time Zone"
            >
              {zones.map((zone: string, index: number) => (
                <Option key={zone} value={zone}>
                  <Tooltip title={zone} placement="right">
                    {<span>{zone}</span>}
                  </Tooltip>
                </Option>
              ))}
            </Select>
          </Form.Item>
          </Tooltip>
        </Form>
      </div>
      <div className="transaction-display">
        <Carousel
          dotPosition="top"
          afterChange={(current: number) => {
            setLedgerSummaryType(LedgerSummaryTypeMap[current]);
            form
              .validateFields()
              .then((values) => {
                updateTransactions(values, LedgerSummaryTypeMap[current]);
              })
              .catch((info) => console.log(info));
          }}
        >
          <div className="transaction-summary">{getDefault()}</div>
          <div className="transaction-payer">{getPayer()}</div>
          <div className="transaction-label">{getLabel()}</div>
          {/* maybe others? */}
        </Carousel>
      </div>

      {ledgerSummaryType === 'DEFAULT' && (
        <div className="transaction-visual">
          <div className="transaction-graph"></div>
        </div>
      )}

      {/* label pie graph */}
      {ledgerSummaryType === 'LABEL' && (
        <div className="transaction-visual">
          <Radio.Group
            defaultValue="expense"
            onChange={(e: RadioChangeEvent) => setGraphCate(e.target.value)}
          >
            {showLabelExpenseTab && <Radio value={'expense'}>Expense</Radio>}
            {showLabelIncomeTab && <Radio value={'income'}>Income</Radio>}
          </Radio.Group>
          <div className="transaction-graph">
            {showLabelExpenseTab || showLabelIncomeTab ? (
              <PieChart width={200} height={200}>
                {/* expense */}
                <Pie
                  dataKey={graphCate}
                  isAnimationActive={false}
                  data={
                    graphCate === 'expense' ? labelExpenseData : labelIncomeData
                  }
                  cx={100}
                  cy={100}
                  outerRadius={60}
                  fill="#8884d8"
                  label
                />
                <HoverHint />
              </PieChart>
            ) : (
              <React.Fragment />
            )}
          </div>
        </div>
      )}

      {ledgerSummaryType === 'PAYER' && (
        <div className="transaction-visual">
          <Radio.Group
            defaultValue={graphCate}
            value={graphCate}
            onChange={(e: RadioChangeEvent) => setGraphCate(e.target.value)}
          >
            {showPayerExpenseTab && <Radio value={'expense'}>Expense</Radio>}
            {showPayerIncomeTab && <Radio value={'income'}>Income</Radio>}
          </Radio.Group>
          <div className="transaction-graph">
            {showPayerExpenseTab || showPayerIncomeTab ? (
              <PieChart width={200} height={200}>
                {/* expense */}
                <Pie
                  dataKey={graphCate}
                  isAnimationActive={false}
                  data={
                    graphCate === 'expense' ? payerExpenseData : payerIncomeData
                  }
                  cx={100}
                  cy={100}
                  outerRadius={60}
                  fill="#8884d8"
                  label
                />
                <HoverHint />
              </PieChart>
            ) : (
              <React.Fragment />
            )}
          </div>
        </div>
      )}
      <List className="transaction-list">
        {transactions.map((item) => (
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
  ledgerSummary: state.transaction.ledgerSummary,
});

export default connect(mapStateToProps, {
  updateTransactions,
  updateExpandedMyself,
})(TransactionProject);
