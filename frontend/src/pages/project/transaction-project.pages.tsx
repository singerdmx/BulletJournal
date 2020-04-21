import React, { useEffect, useState } from 'react';
import {
  Pie,
  PieChart,
  Tooltip as HoverHint,
  LineChart,
  XAxis,
  Legend,
  Line,
  ResponsiveContainer,
  YAxis,
  Cell,
} from 'recharts';
import { IState } from '../../store';
import { connect } from 'react-redux';
import {
  Carousel,
  DatePicker,
  Form,
  List,
  Radio,
  Select,
  Tooltip,
  Empty,
} from 'antd';
import moment from 'moment';
import { dateFormat } from '../../features/myBuJo/constants';
import './project.styles.less';
import { zones } from '../../components/settings/constants';
import {
  updateTransactions,
  updateTransactionForm,
} from '../../features/transactions/actions';
import { updateExpandedMyself } from '../../features/myself/actions';
import {
  LedgerSummary,
  LedgerSummaryType,
  TransactionsSummary,
  FrequencyType,
} from '../../features/transactions/interface';
import TransactionItem from '../../components/project-item/transaction-item.component';
import './transaction.styles.less';
import LedgerSummaries from '../../components/ledger-summary/ledger-summary';
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
const LocaleCurrency = require('locale-currency');
const LedgerSummaryTypeMap = [
  LedgerSummaryType.DEFAULT,
  LedgerSummaryType.PAYER,
  LedgerSummaryType.LABEL,
];

type TransactionProps = {
  currency: string;
  projectId: number;
  timezone: string;
  ledgerSummary: LedgerSummary;

  updateExpandedMyself: (updateSettings: boolean) => void;
  updateTransactions: (
    projectId: number,
    timezone: string,
    ledgerSummaryType: string,
    frequencyType?: string,
    startDate?: string,
    endDate?: string
  ) => void;
  updateTransactionForm: (
    startDate?: string,
    endDate?: string,
    frequencyType?: FrequencyType,
    ledgerSummaryType?: LedgerSummaryType,
    timezone?: string
  ) => void;
};

const TransactionProject: React.FC<TransactionProps> = (props) => {
  const [form] = Form.useForm();
  const [ledgerSummaryType, setLedgerSummaryType] = useState(
    LedgerSummaryType.DEFAULT
  );
  // default line chart
  const [lineData, setLineData] = useState([{}]);
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
    currentLedgerSummaryType: LedgerSummaryType
  ) => {
    //reset tab to false when refresh
    setShowLabelExpenseTab(false);
    setShowLabelIncomeTab(false);
    setShowPayerExpenseTab(false);
    setShowPayerIncomeTab(false);

    const startDate = values.date[0].format(dateFormat);
    const endDate = values.date[1].format(dateFormat);
    const frequencyType = values.frequencyType || FrequencyType.MONTHLY;

    props.updateTransactions(
      props.projectId,
      values.timezone,
      currentLedgerSummaryType,
      frequencyType,
      startDate,
      endDate
    );
  };

  useEffect(() => {
    const startDate = moment().startOf('month').format(dateFormat);
    const endDate = moment().endOf('month').format(dateFormat);
    //update form initial data
    props.updateTransactionForm(
      startDate,
      endDate,
      FrequencyType.MONTHLY,
      LedgerSummaryType.DEFAULT,
      currentZone
    );
    props.updateExpandedMyself(true);
    props.updateTransactions(
      props.projectId,
      currentZone,
      ledgerSummaryType,
      'MONTHLY',
      startDate,
      endDate
    );
  }, []);

  useEffect(() => {
    if (ledgerSummaryType === LedgerSummaryType.LABEL) {
      const newExpenseData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showLabelExpenseTab && transaction.expense !== 0) {
            setShowLabelExpenseTab(true);
            setGraphCate('expense');
          }
          return {
            name: transaction.name,
            expense: transaction.expense,
            expensePercentage: transaction.expensePercentage,
            expenseCount: transaction.expenseCount,
          };
        }
      );
      setLabelExpenseData(newExpenseData);
      const newIncomeData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showLabelIncomeTab && transaction.income !== 0) {
            setShowLabelIncomeTab(true);
            setGraphCate('income');
          }
          return {
            name: transaction.name,
            income: transaction.income,
            incomePercentage: transaction.incomePercentage,
            incomeCount: transaction.incomeCount,
          };
        }
      );
      setLabelIncomeData(newIncomeData);
    } else if (ledgerSummaryType === LedgerSummaryType.PAYER) {
      const newExpenseData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showPayerExpenseTab && transaction.expense !== 0) {
            setShowPayerExpenseTab(true);
            setGraphCate('expense');
          }
          return {
            name: transaction.name,
            expense: transaction.expense,
            expensePercentage: transaction.expensePercentage,
            expenseCount: transaction.expenseCount,
          };
        }
      );
      setPayerExpenseData(newExpenseData);
      const newIncomeData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showPayerIncomeTab && transaction.income !== 0) {
            setShowPayerIncomeTab(true);
            setGraphCate('income');
          }
          return {
            name: transaction.name,
            income: transaction.income,
            incomePercentage: transaction.incomePercentage,
            incomeCount: transaction.incomeCount,
          };
        }
      );
      setPayerIncomeData(newIncomeData);
    } else if (ledgerSummaryType === LedgerSummaryType.DEFAULT) {
      const newLineData =
        transactionsSummaries &&
        transactionsSummaries.map((transaction: TransactionsSummary) => {
          return {
            name: transaction.name,
            income: transaction.income,
            expense: transaction.expense,
            balance: transaction.balance,
          };
        });
      setLineData(newLineData);
    } else {
      setLabelExpenseData([]);
      setLabelIncomeData([]);
      setShowLabelExpenseTab(false);
      setShowLabelIncomeTab(false);
      setPayerExpenseData([]);
      setPayerIncomeData([]);
      setLineData([]);
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
      ></LedgerSummaries>
    );
  };

  const getPayer = () => {
    return (
      <LedgerSummaries
        title={'Payer'}
        balance={balance}
        income={income}
        expense={expense}
        startDate={startDate}
        endDate={endDate}
      ></LedgerSummaries>
    );
  };

  const getLabel = () => {
    return (
      <LedgerSummaries
        title={'Label'}
        balance={balance}
        income={income}
        expense={expense}
        startDate={startDate}
        endDate={endDate}
      ></LedgerSummaries>
    );
  };

  const handleFilterChange = (changed: any, allValue: any) => {
    form
      .validateFields()
      .then((values) => {
        updateTransactions(values, ledgerSummaryType);
      })
      .catch((info) => console.log(info));
  };

  const PieTooltipContent = (input: any) => {
    if (!input.payload.length) return null;

    const currency = props.currency ? LocaleCurrency.getCurrency(props.currency) : '';
    return (
      <div>
        [{input.payload[0].name}]&nbsp;{`${input.payload[0].value} ${currency}`} (
        {graphCate === 'expense'
          ? `${input.payload[0].payload.payload.expensePercentage}%`
          : `${input.payload[0].payload.payload.incomePercentage}%`}
        )
      </div>
    );
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div className='transaction-page'>
      <div className='transaction-control'>
        <Form
          form={form}
          onValuesChange={handleFilterChange}
          layout='inline'
          initialValues={{
            frequencyType: 'MONTHLY',
            timezone: props.timezone ? props.timezone : currentZone,
            date: [moment().startOf('month'), moment().endOf('month')],
          }}
        >
          {ledgerSummaryType === 'DEFAULT' && (
            <Form.Item name='frequencyType'>
              <Radio.Group
                value='YEARLY'
                size='small'
                buttonStyle='solid'
                onChange={(e: any) => {
                  let updateType = undefined;
                  if (e.target.value === 'MONTHLY') {
                    updateType = FrequencyType.MONTHLY;
                  } else if (e.target.value === 'YEARLY') {
                    updateType = FrequencyType.YEARLY;
                  } else {
                    updateType = FrequencyType.WEEKLY;
                  }
                  props.updateTransactionForm(
                    undefined,
                    undefined,
                    updateType,
                    undefined,
                    undefined
                  );
                }}
              >
                <Tooltip title='WEEKLY'>
                  <Radio.Button value='WEEKLY'>W</Radio.Button>
                </Tooltip>
                <Tooltip title='MONTHLY'>
                  <Radio.Button value='MONTHLY'>M</Radio.Button>
                </Tooltip>
                <Tooltip title='YEARLY'>
                  <Radio.Button value='YEARLY'>Y</Radio.Button>
                </Tooltip>
              </Radio.Group>
            </Form.Item>
          )}

          <Form.Item name='date'>
            <RangePicker
              onChange={(dates: any, dateStrings: string[]) => {
                props.updateTransactionForm(
                  dateStrings[0],
                  dateStrings[1],
                  undefined,
                  undefined,
                  undefined
                );
              }}
              ranges={{
                Today: [moment(), moment()],
                'This Week': [moment().startOf('week'), moment().endOf('week')],
                'This Month': [
                  moment().startOf('month'),
                  moment().endOf('month'),
                ],
              }}
              size='small'
              allowClear={true}
              format={dateFormat}
              placeholder={['Start Date', 'End Date']}
            />
          </Form.Item>

          <Tooltip title='Time Zone'>
            <Form.Item name='timezone'>
              <Select
                size='small'
                style={{ maxWidth: 100 }}
                dropdownMatchSelectWidth={200}
                showSearch={true}
                placeholder='Select Time Zone'
                onChange={(value: string) => {
                  props.updateTransactionForm(
                    undefined,
                    undefined,
                    undefined,
                    undefined,
                    value
                  );
                }}
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
          </Tooltip>
        </Form>
      </div>
      <div className='transaction-display'>
        <Carousel
          dotPosition='top'
          afterChange={(current: number) => {
            setLedgerSummaryType(LedgerSummaryTypeMap[current]);
            props.updateTransactionForm(
              undefined,
              undefined,
              undefined,
              LedgerSummaryTypeMap[current],
              undefined
            );
            form
              .validateFields()
              .then((values) => {
                updateTransactions(values, LedgerSummaryTypeMap[current]);
              })
              .catch((info) => console.log(info));
          }}
        >
          <div className='transaction-summary'>{getDefault()}</div>
          <div className='transaction-payer'>{getPayer()}</div>
          <div className='transaction-label'>{getLabel()}</div>
          {/* maybe others? */}
        </Carousel>
      </div>

      <div className='transaction-display-mini'>
        <Carousel dotPosition='left' autoplay>
          {transactionsSummaries ? (
            transactionsSummaries.map(
              (transactionsSummary: TransactionsSummary, index: number) => (
                <div
                  key={`${transactionsSummary.name}-${index}`}
                  className='transaction-display-mini-content'
                >
                  <span className='title'>{transactionsSummary.name}</span>
                  <span>Expense: {transactionsSummary.expensePercentage}%</span>
                  <span>Income: {transactionsSummary.incomePercentage}%</span>
                </div>
              )
            )
          ) : (
            <div>LedgerSummaries</div>
          )}
        </Carousel>
      </div>

      {ledgerSummaryType === LedgerSummaryType.DEFAULT && (
        <div className='transaction-visual'>
          <div className='transaction-graph'>
            {transactionsSummaries ? (
              <ResponsiveContainer>
                <LineChart
                  data={lineData}
                  height={200}
                  margin={{ left: 5, bottom: 5, right: 50, top: 20 }}
                >
                  <XAxis dataKey='name' />
                  <YAxis />
                  <Legend />
                  <Line type='monotone' dataKey='expense' stroke='#8884d8' />
                  <Line type='monotone' dataKey='income' stroke='#82ca9d' />
                  <Line type='monotone' dataKey='balance' stroke='#3437eb' />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      )}

      {/* label pie graph */}
      {ledgerSummaryType === LedgerSummaryType.LABEL && (
        <div className='transaction-visual'>
          <Radio.Group
            defaultValue={graphCate}
            value={graphCate}
            onChange={(e: RadioChangeEvent) => setGraphCate(e.target.value)}
          >
            {showLabelExpenseTab && <Radio value={'expense'}>Expense</Radio>}
            {showLabelIncomeTab && <Radio value={'income'}>Income</Radio>}
          </Radio.Group>
          <div className='transaction-graph'>
            {showLabelExpenseTab || showLabelIncomeTab ? (
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    dataKey={graphCate}
                    isAnimationActive={false}
                    data={
                      graphCate === 'expense'
                        ? labelExpenseData
                        : labelIncomeData
                    }
                    outerRadius={60}
                    labelLine={false}
                    fill='#8884d8'
                  />
                  <Cell key={0} fill='#0088FE' />
                  <Cell key={1} fill='#1081FE' />
                  {/* {graphCate === 'expense'
                    ? labelExpenseData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))
                    : labelIncomeData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))} */}

                  <HoverHint content={<PieTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      )}
      {/* payer pie graph */}
      {ledgerSummaryType === LedgerSummaryType.PAYER && (
        <div className='transaction-visual'>
          <Radio.Group
            defaultValue={graphCate}
            value={graphCate}
            onChange={(e: RadioChangeEvent) => setGraphCate(e.target.value)}
          >
            {showPayerExpenseTab && <Radio value={'expense'}>Expense</Radio>}
            {showPayerIncomeTab && <Radio value={'income'}>Income</Radio>}
          </Radio.Group>
          <div className='transaction-graph'>
            {showPayerExpenseTab || showPayerIncomeTab ? (
              <ResponsiveContainer>
                <PieChart width={200} height={200}>
                  <HoverHint content={<PieTooltipContent />} />
                  <Pie
                    dataKey={graphCate}
                    isAnimationActive={false}
                    data={
                      graphCate === 'expense'
                        ? payerExpenseData
                        : payerIncomeData
                    }
                    outerRadius={60}
                    fill='#8884d8'
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Empty />
            )}
          </div>
        </div>
      )}
      <List className='transaction-list'>
        {transactions.map((item) => (
          <List.Item key={item.id} className='transaction-list-item'>
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
  currency: state.myself.currency,
});

export default connect(mapStateToProps, {
  updateTransactions,
  updateExpandedMyself,
  updateTransactionForm,
})(TransactionProject);
