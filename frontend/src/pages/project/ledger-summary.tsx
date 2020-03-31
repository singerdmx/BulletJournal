import React from 'react';
import { Statistic } from 'antd';

type LedgerSummaryProps = {
  balance: number;
  income: number;
  expense: number;
  startDate: string;
  endDate: string;
};

const LedgerSummary: React.FC<LedgerSummaryProps> = props => {
  const { balance, income, expense, startDate, endDate } = props;

  return (
    <span style={{ display: 'flex' }}>
      <span>
        {startDate} - {endDate}
      </span>
      <Statistic title='Balance' value={balance} />
      <Statistic title='Income' value={income} />
      <Statistic title='Expense' value={expense} />
    </span>
  );
};

export default LedgerSummary;
