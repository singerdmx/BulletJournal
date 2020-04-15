import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip as HoverHint } from "recharts";
import { IState } from "../../store";
import { connect } from "react-redux";
import {
  Carousel,
  Radio,
  DatePicker,
  Tooltip,
  Select,
  Form,
  List,
  Tabs,
} from "antd";

import { SyncOutlined } from "@ant-design/icons";
import { dateFormat } from "../../features/myBuJo/constants";
import "./project.styles.less";
import { zones } from "../../components/settings/constants";
import { updateTransactions } from "../../features/transactions/actions";
import { updateExpandedMyself } from "../../features/myself/actions";
import { LedgerSummary } from "../../features/transactions/interface";
import TransactionItem from "../../components/project-item/transaction-item.component";
import "./transaction.styles.less";
import LedgerSummaries from "../../components/ledger-summary/ledger-summary";
import { TransactionsSummary } from "../../features/transactions/interface";

const { RangePicker } = DatePicker;
const { Option } = Select;
const currentZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const currentCountry = currentZone && currentZone.split("/")[0];
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
const LedgerSummaryTypeMap = ["DEFAULT", "PAYER", "LABEL", "TIMELINE"];
const { TabPane } = Tabs;

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
  const [ledgerSummaryType, setLedgerSummaryType] = useState("DEFAULT");
  //used for LABEL pie
  const [labelExpenseData, setLabelExpenseData] = useState([{}]);
  const [labelIncomeData, setLabelIncomeData] = useState([{}]);
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
      "MONTHLY",
      ledgerSummaryType,
      "",
      ""
    );
  }, []);

  useEffect(() => {
    if (ledgerSummaryType === "LABEL") {
      const newExpenseData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showLabelExpenseTab && transaction.expense !== 0) {
            setShowLabelExpenseTab(true);
          }
          return { name: transaction.name, expense: transaction.expense };
        }
      );
      setLabelExpenseData(newExpenseData);
      const newIncomeData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showLabelIncomeTab && transaction.income !== 0)
            setShowLabelIncomeTab(true);
          return { name: transaction.name, income: transaction.income };
        }
      );
      setLabelIncomeData(newIncomeData);
    } else if (ledgerSummaryType === "PAYER") {
      const newExpenseData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showPayerExpenseTab && transaction.expense !== 0) {
            setShowPayerExpenseTab(true);
          }
          return { name: transaction.name, expense: transaction.expense };
        }
      );
      setPayerExpenseData(newExpenseData);
      const newIncomeData = transactionsSummaries.map(
        (transaction: TransactionsSummary) => {
          if (!showPayerIncomeTab && transaction.income !== 0)
            setShowPayerIncomeTab(true);
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
        title={""}
        balance={balance}
        income={income}
        expense={expense}
        startDate={startDate}
        endDate={endDate}
      >
        {" "}
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
          : "Loading..."}
      </LedgerSummaries>
    );
  };

  const getPayer = () => {
    return (
      <LedgerSummaries
        title={"By Payer"}
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
          : "Loading..."}{" "}
      </LedgerSummaries>
    );
  };

  const getLabel = () => {
    return (
      <LedgerSummaries
        title={"By Label"}
        balance={balance}
        income={income}
        expense={expense}
        startDate={startDate}
        endDate={endDate}
      >
        {" "}
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
          : "Loading..."}
      </LedgerSummaries>
    );
  };

  const getTimeline = () => {
    return (
      <LedgerSummaries
        title={"Timeline"}
        balance={balance}
        income={income}
        expense={expense}
        startDate={startDate}
        endDate={endDate}
      >
        {" "}
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
          : "Loading..."}
      </LedgerSummaries>
    );
  };

  return (
    <div className="transaction-page">
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
          <div className="transaction-timeline">{getTimeline()}</div>
          {/* maybe others? */}
        </Carousel>
      </div>

      {/* label pie graph */}
      {ledgerSummaryType === "LABEL" && (
        <div style={{ border: "1px solid black" }}>
          <Tabs>
            {showLabelExpenseTab && (
              <TabPane tab="Expense" key="expense">
                <PieChart width={800} height={200}>
                  {/* expense */}
                  <Pie
                    dataKey="expense"
                    isAnimationActive={false}
                    data={labelExpenseData}
                    cx={140}
                    cy={100}
                    outerRadius={60}
                    fill="#8884d8"
                    label
                  />
                  <HoverHint />
                </PieChart>
              </TabPane>
            )}
            {showLabelIncomeTab && (
              <TabPane tab="Income" key="income">
                <PieChart width={800} height={200}>
                  {/* income */}
                  <Pie
                    dataKey="income"
                    isAnimationActive={false}
                    data={labelIncomeData}
                    cx={140}
                    cy={100}
                    outerRadius={60}
                    fill="#8884d8"
                    label
                  />
                  <HoverHint />
                </PieChart>
              </TabPane>
            )}
          </Tabs>
        </div>
      )}

      {/* payer pie graph */}
      {ledgerSummaryType === "PAYER" && (
        <div style={{ border: "1px solid black" }}>
          <Tabs>
            {showPayerExpenseTab && (
              <TabPane tab="Expense" key="expense">
                <PieChart width={800} height={200}>
                  {/* expense */}
                  <Pie
                    dataKey="expense"
                    isAnimationActive={false}
                    data={payerExpenseData}
                    cx={140}
                    cy={100}
                    outerRadius={60}
                    fill="#8884d8"
                    label
                  />
                  <HoverHint />
                </PieChart>
              </TabPane>
            )}
            {showPayerIncomeTab && (
              <TabPane tab="Income" key="income">
                <PieChart width={800} height={200}>
                  {/* income */}
                  <Pie
                    dataKey="income"
                    isAnimationActive={false}
                    data={payerIncomeData}
                    cx={140}
                    cy={100}
                    outerRadius={60}
                    fill="#8884d8"
                    label
                  />
                  <HoverHint />
                </PieChart>
              </TabPane>
            )}
          </Tabs>
        </div>
      )}

      <div className="transaction-control">
        <Form
          form={form}
          initialValues={{
            frequencyType: "MONTHLY",
            timezone: props.timezone ? props.timezone : currentZone,
          }}
        >
          <Form.Item name="frequencyType">
            <Radio.Group value="YEARLY">
              <Radio value="WEEKLY">WEEKLY</Radio>
              <Radio value="MONTHLY">MONTHLY</Radio>
              <Radio value="YEARLY">YEARLY</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item name="date">
            <RangePicker
              allowClear={true}
              format={dateFormat}
              placeholder={["Start Date", "End Date"]}
            />
          </Form.Item>

          <Form.Item name="timezone">
            <Select
              style={{ width: "200px" }}
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

          <Tooltip title={"Click to Refresh Transactions"}>
            <SyncOutlined
              onClick={() => {
                form
                  .validateFields()
                  .then((values) => {
                    console.log(values);
                    updateTransactions(values, ledgerSummaryType);
                  })
                  .catch((info) => console.log(info));
              }}
            />
          </Tooltip>
        </Form>
      </div>
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
