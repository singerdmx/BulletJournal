import React from 'react';
import { Statistic } from 'antd';

type LedgerSummaryProps = {
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
        <Statistic title='Balance' value={balance} />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Statistic title='Income' value={income} />
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <Statistic title='Expense' value={expense} />
      </span>
    </span>
  );
};

export default LedgerSummary;
