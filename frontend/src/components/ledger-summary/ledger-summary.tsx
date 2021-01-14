import React from 'react';
import { Statistic, Card, Tag } from 'antd';
import { IState } from '../../store';
import { connect } from 'react-redux';
import './ledger-summary.styles.less';
import { ProjectSetting } from '../../features/project/interface';
import CSS from 'csstype';


const LocaleCurrency = require('locale-currency');

type LedgerSummaryProps = {
  currency: string;
  title: string;
  balance: number;
  income: number;
  expense: number;
  startDate: string;
  endDate: string;
  projectSetting: ProjectSetting;
};

const LedgerSummary: React.FC<LedgerSummaryProps> = (props) => {
  const { title, balance, income, expense, startDate, endDate, projectSetting } = props;
  const bgColorSetting = projectSetting.color ? JSON.parse(projectSetting.color) : undefined;
  const bgColor : CSS.Properties = {
    background: bgColorSetting ? `rgba(${ bgColorSetting.r }, ${ bgColorSetting.g }, ${ bgColorSetting.b }, ${ bgColorSetting.a })` : undefined
  } 
  return (
    <div className="ledger-summary">
      <div className="ledger-selection">
        {title.length > 0 && (
          <Tag color="orange" className="ledger-category">
            {title}
          </Tag>
        )}
        <span className="ledger-time">
          {startDate} - {endDate}
        </span>
      </div>
      <div className="ledger-static">
        <Card bordered={false} style={bgColor}>
          <Statistic
            title={`Balance (${LocaleCurrency.getCurrency(props.currency)})`}
            value={balance}
          />
        </Card>

        <Card bordered={false}  style={bgColor}>
          <Statistic
            title={`Income (${LocaleCurrency.getCurrency(props.currency)})`}
            value={income}
          />
        </Card>
        <Card bordered={false} style={bgColor}>
          <Statistic
            title={`Expense (${LocaleCurrency.getCurrency(props.currency)})`}
            value={expense}
          />
        </Card>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  currency: state.myself.currency,
  projectSetting: state.project.setting,
});

export default connect(mapStateToProps, {})(LedgerSummary);
