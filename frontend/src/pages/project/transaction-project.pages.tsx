import React, { useEffect } from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Carousel, Radio, DatePicker, Tooltip, Select } from 'antd';
import moment from 'moment';
import { dateFormat } from '../../features/myBuJo/constants';
import './project.styles.less';
import { zones } from '../../components/settings/constants';
import { updateTransactions } from '../../features/transactions/actions';
import { updateExpandedMyself } from '../../features/myself/actions';

import './transaction.styles.less';

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

type TransactionProps = {
  projectId: number;
  transactionTimezone: string;
  frequencyType: string;
  timezone: string;
  startDate: string;
  endDate: string;
  ledgerSummaryType: string;
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
  const onChangeFrequency = (e: any) => {
    props.updateTransactions(
      props.projectId,
      props.transactionTimezone,
      e.target.value,
      props.ledgerSummaryType,
      props.startDate,
      props.endDate
    );
  };

  useEffect(() => {
    props.updateExpandedMyself(true);
    props.updateTransactions(
      props.projectId,
      props.timezone
        ? props.timezone
        : Intl.DateTimeFormat().resolvedOptions().timeZone,
      props.frequencyType,
      props.ledgerSummaryType,
      props.startDate,
      props.endDate
    );
  }, []);

  return (
    <div className="transaction-page">
      <div className="transaction-display">
        <Carousel autoplay dotPosition="bottom">
          <div className="transaction-number">1400</div>
          <div className="transaction-static">graph</div>
          {/* maybe others? */}
        </Carousel>
      </div>
      <div className="transaction-control">
        <Radio.Group value={props.frequencyType} onChange={onChangeFrequency}>
          <Radio value="WEEKLY">WEEKLY</Radio>
          <Radio value="MONTHLY">MONTHLY</Radio>
          <Radio value="YEARLY">YEARLY</Radio>
        </Radio.Group>

        <div className="time-range">
          <RangePicker
            allowClear={false}
            value={[
              props.startDate ? moment(props.startDate, dateFormat) : null,
              props.endDate ? moment(props.endDate, dateFormat) : null
            ]}
            format={dateFormat}
          />
          <Select
            style={{ width: '200px' }}
            showSearch={true}
            placeholder="Select Time Zone"
            value={props.transactionTimezone ? props.transactionTimezone : ''}
          >
            {zones.map((zone: string, index: number) => (
              <Option key={zone} value={zone}>
                <Tooltip title={zone} placement="right">
                  {<span>{zone}</span>}
                </Tooltip>
              </Option>
            ))}
          </Select>
        </div>
      </div>
      <div className="trasaction-ist"></div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  projectId: state.project.project.id,
  frequencyType: state.transaction.frequencyType,
  timezone: state.settings.timezone,
  transactionTimezone: state.transaction.timezone,
  startDate: state.transaction.startDate,
  endDate: state.transaction.endDate,
  ledgerSummaryType: state.transaction.ledgerSummaryType
});

export default connect(mapStateToProps, {
  updateTransactions,
  updateExpandedMyself
})(TransactionProject);
