import React, { useEffect, useState } from 'react';
import {
  Avatar,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  TimePicker,
  Tooltip
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { createTransaction } from '../../features/transactions/actions';
import { IState } from '../../store';
import { Project } from '../../features/project/interface';
import { Group } from '../../features/group/interface';
import './modals.styles.less';
import { updateExpandedMyself } from '../../features/myself/actions';
import { zones } from '../settings/constants';

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

const LocaleCurrency = require('locale-currency'); //currency code

type TransactionProps = {
  project: Project;
  group: Group;
};

interface TransactionCreateFormProps {
  createTransaction: (
    projectId: number,
    amount: number,
    name: string,
    payer: string,
    date: string,
    transactionType: number,
    timezone: string,
    time: string
  ) => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
  currency: string;
  timezone: string;
  myself: string;
}

const AddTransaction: React.FC<RouteComponentProps &
  TransactionProps &
  TransactionCreateFormProps> = props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const addTransaction = (values: any) => {
    //convert time object to format string
    const date_value = values.date.format('YYYY-MM-DD');
    const time_value = values.time ? values.time.format('HH:mm') : undefined;
    props.createTransaction(
      props.project.id,
      values.amount,
      values.transactionName,
      values.payerName ? values.payerName : props.myself,
      date_value,
      values.transactionType,
      values.timezone ? values.timezone : props.timezone,
      time_value
    );
    setVisible(false);
  };
  const onCancel = () => setVisible(false);
  const openModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    props.updateExpandedMyself(true);
  }, []);

  return (
    <Tooltip placement='top' title='Create New Transaction'>
      <div className='add-transaction'>
        <PlusOutlined
          style={{ fontSize: 20, cursor: 'pointer' }}
          onClick={openModal}
          title='Create New Transaction'
        />
        <Modal
          destroyOnClose
          centered
          title='Create New Transaction'
          visible={visible}
          okText='Create'
          onCancel={onCancel}
          onOk={() => {
            form
              .validateFields()
              .then(values => {
                console.log(values);
                form.resetFields();
                addTransaction(values);
              })
              .catch(info => console.log(info));
          }}
        >
          <Form form={form} labelAlign='left'>
            <Form.Item
              name='transactionName'
              label='Name'
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              rules={[{ required: true, message: 'Missing Transaction Name!' }]}
            >
              <Input placeholder='Enter Transaction Name' allowClear />
            </Form.Item>
            <Form.Item
              name='payerName'
              label='Payer'
              labelCol={{ span: 4 }}
              style={{ marginLeft: '10px' }}
              wrapperCol={{ span: 20 }}
            >
              {!props.group.users ? null : (
                <Select
                  defaultValue={props.myself}
                  style={{ marginLeft: '-8px' }}
                >
                  {props.group.users.map(user => {
                    return (
                      <Option value={user.name} key={user.name}>
                        <Avatar size='small' src={user.avatar} />
                        &nbsp;&nbsp; <strong>{user.name}</strong>
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
            <div style={{ display: 'flex' }}>
              <Form.Item
                name='amount'
                label='Amount'
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 8 }}
                rules={[{ required: true, message: 'Missing Amount!' }]}
              >
                <InputNumber
                  style={{ width: 160 }}
                  formatter={value =>
                    `${LocaleCurrency.getCurrency(props.currency)} ${value}`
                  }
                  parser={value => {
                    return value ? value.replace(/^[A-Za-z]+\s?/g, '') : 0;
                  }}
                />
              </Form.Item>

              <Form.Item
                name='transactionType'
                style={{ marginLeft: 15 }}
                colon={false}
                rules={[{ required: true, message: 'Missing Type!' }]}
              >
                <Radio.Group>
                  <Radio value={0}>Income</Radio>
                  <Radio value={1}>Expense</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div style={{ display: 'flex' }}>
              <Tooltip title='Select Date'>
                <Form.Item
                  name='date'
                  rules={[{ required: true, message: 'Missing Date!' }]}
                >
                  <DatePicker placeholder='Select Date' />
                </Form.Item>
              </Tooltip>
              <Tooltip title='Select Time'>
                <Form.Item name='time' style={{ width: '100px' }}>
                  <TimePicker
                    allowClear
                    format='HH:mm'
                    placeholder='Select Time'
                  />
                </Form.Item>
              </Tooltip>

              <Tooltip title='Time Zone'>
                <Form.Item name='timezone'>
                  <Select
                    showSearch={true}
                    placeholder='Select Time Zone'
                    defaultValue={props.timezone ? props.timezone : ''}
                  >
                    {zones.map((zone: string, index: number) => (
                      <Option key={zone} value={zone}>
                        <Tooltip title={zone} placement='right'>
                          {zone}
                        </Tooltip>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Tooltip>
            </div>
          </Form>
        </Modal>
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  group: state.group.group,
  currency: state.settings.currency,
  timezone: state.settings.timezone,
  myself: state.myself.username
});

export default connect(mapStateToProps, {
  createTransaction,
  updateExpandedMyself
})(withRouter(AddTransaction));
