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
  Form
} from 'antd';
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
const LedgerSummaryTypeMap = ['DEFAULT', 'PAYER', 'LABEL', 'TIMELINE'];

type TransactionProps = {
  projectId: number;
  timezone: string;
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

  const updateTransactions = (values: any) => {
    const startDate = values.date ? values.date[0].format('YYYY-MM-DD') : null;
    const endDate = values.date ? values.date[1].format('YYYY-MM-DD') : null;

    props.updateTransactions(
      props.projectId,
      values.timezone,
      values.frequencyType,
      ledgerSummaryType,
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

  return (
    <div className='transaction-page'>
      <div className='transaction-display'>
        <Carousel
          dotPosition='bottom'
          afterChange={(current: number) => {
            console.log(LedgerSummaryTypeMap[current]);
            setLedgerSummaryType(LedgerSummaryTypeMap[current]);
          }}
        >
          <div className='transaction-number'>{LedgerSummaryTypeMap[0]}</div>
          <div className='transaction-static'>{LedgerSummaryTypeMap[1]}</div>
          <div className='transaction-static'>{LedgerSummaryTypeMap[2]}</div>
          <div className='transaction-static'>{LedgerSummaryTypeMap[3]}</div>
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

          <Button
            onClick={() => {
              form
                .validateFields()
                .then(values => {
                  console.log(values);
                  updateTransactions(values);
                })
                .catch(info => console.log(info));
            }}
          >
            Search
          </Button>
        </Form>
      </div>
      <div className='transaction-list'></div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  projectId: state.project.project.id,
  timezone: state.settings.timezone
});

export default connect(mapStateToProps, {
  updateTransactions,
  updateExpandedMyself
})(TransactionProject);
