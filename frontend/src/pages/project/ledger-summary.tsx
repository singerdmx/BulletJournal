import React from 'react';
import { Statistic } from 'antd';
import {IState} from "../../store";
import {connect} from "react-redux";
const LocaleCurrency = require('locale-currency'); //currency code

type LedgerSummaryProps = {
  currency: string;
  title: string;
  balance: number;
  income: number;
  expense: number;
  startDate: string;
  endDate: string;
};

const LedgerSummary: React.FC<LedgerSummaryProps> = props => {
  const { title, balance, income, expense, startDate, endDate } = props;

  return (
    <span>
      <span>
        <b>{title}&nbsp;&nbsp;</b>
        {startDate} - {endDate}
      </span>
      <br />
      <span style={{ display: 'flex' }}>
        <Statistic title={`Balance (${LocaleCurrency.getCurrency(props.currency)})`} value={balance} />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Statistic title={`Income (${LocaleCurrency.getCurrency(props.currency)})`} value={income} />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Statistic title={`Expense (${LocaleCurrency.getCurrency(props.currency)})`} value={expense} />
      </span>
    </span>
  );
};

const mapStateToProps = (state: IState) => ({
    currency: state.myself.currency,
});

export default connect(mapStateToProps, {})(LedgerSummary);
