import React, { useState, useEffect } from 'react';
import {
  Modal,
  Input,
  Tooltip,
  Form,
  DatePicker,
  Select,
  Avatar,
  InputNumber,
  Radio,
  TimePicker
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
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
var LocaleCurrency = require('locale-currency'); //currency code

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
    time: string,
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
    props.createTransaction(
      props.project.id,
      values.amount,
      values.transactionName,
      values.payerName ? values.payerName : props.myself,
      values.date,
      values.transactionType,
      values.timezone ? values.timezone : props.timezone,
      values.time
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
          <Form form={form}>
            <Form.Item
              name='transactionName'
              rules={[{ required: true, message: 'Missing Transaction Name!' }]}
            >
              <Input placeholder='Enter Transaction Name' allowClear />
            </Form.Item>
            <div style={{ display: 'flex' }}>
              <span>Payer&nbsp;&nbsp;</span>
              <Form.Item name='payerName' style={{ width: '100%' }}>
                {!props.group.users ? null : (
                  <Select defaultValue={props.myself}>
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
            </div>
            <div style={{ display: 'flex' }}>
              <Form.Item
                name='amount'
                rules={[{ required: true, message: 'Missing Amount!' }]}
                style={{ display: 'flex' }}
              >
                <InputNumber
                  placeholder='Enter Amount'
                  style={{ width: '70%' }}
                />
              </Form.Item>
              <span>
                &nbsp;&nbsp;{LocaleCurrency.getCurrency(props.currency)}
                &nbsp;&nbsp;
              </span>

              <Form.Item
                name='transactionType'
                rules={[{ required: true, message: 'Missing Type!' }]}
                style={{ marginLeft: '30px' }}
              >
                <Radio.Group>
                  <Radio value={0}>Income</Radio>
                  <Radio value={1}>Expense</Radio>
                </Radio.Group>
              </Form.Item>
            </div>

            <div style={{ display: 'flex' }}>
              <Form.Item
                name='date'
                style={{ width: '180px' }}
                rules={[{ required: true, message: 'Missing Date!' }]}
              >
                <DatePicker placeholder='Select Date' />
              </Form.Item>

              <Form.Item name='time' style={{ width: '180px' }}>
                <TimePicker
                  allowClear
                  format='HH:mm'
                  placeholder='Select Time'
                />
              </Form.Item>

              <Form.Item name='timezone'>
                <Tooltip title="Time Zone">
                  <Select
                    showSearch={true}
                    placeholder='Select a Timezone'
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
                </Tooltip>
              </Form.Item>
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
