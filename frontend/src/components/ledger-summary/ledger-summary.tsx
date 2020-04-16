import React, { ReactNode } from 'react';
import { Statistic, Card } from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './ledger-summary.styles.less';

const LocaleCurrency = require('locale-currency');

type LedgerSummaryProps = {
  currency: string;
  title: string;
  balance: number;
  income: number;
  expense: number;
  startDate: string;
  endDate: string;
  children: ReactNode;
};

const LedgerSummary: React.FC<LedgerSummaryProps> = (props) => {
  const {
    title,
    balance,
    income,
    expense,
    startDate,
    endDate,
    children,
  } = props;

  return (
    <div className="ledger-summary">
      <div>
        <b>{title}</b>
        {startDate} - {endDate}
      </div>
      <div className="ledger-static">
        <Card bordered={false}>
          <Statistic
            title={`Balance (${LocaleCurrency.getCurrency(props.currency)})`}
            value={balance}
          />
        </Card>

        <Card bordered={false}>
          <Statistic
            title={`Income (${LocaleCurrency.getCurrency(props.currency)})`}
            value={income}
          />
        </Card>
        <Card bordered={false}>
          <Statistic
            title={`Expense (${LocaleCurrency.getCurrency(props.currency)})`}
            value={expense}
          />
        </Card>
      </div>
      <div>{children}</div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  currency: state.myself.currency,
});

export default connect(mapStateToProps, {})(LedgerSummary);
