import React, { useEffect, useState } from 'react';
import {
  Avatar,
  DatePicker,
  Form,
  Input,
  Modal,
  Radio,
  Select,
  TimePicker,
  Tooltip,
  InputNumber,
} from 'antd';
import { EditTwoTone } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, useParams } from 'react-router';
import { IState } from '../../store';
import './modals.styles.less';
import { Transaction } from '../../features/transactions/interface';
import { Project } from '../../features/project/interface';
import { Group } from '../../features/group/interface';
import { updateExpandedMyself } from '../../features/myself/actions';
import { zones } from '../settings/constants';
import { dateFormat } from '../../features/myBuJo/constants';
import moment from 'moment';
import { patchTransaction } from '../../features/transactions/actions';
import { getIcon } from '../draggable-labels/draggable-label-list.component';
import { Label } from '../../features/label/interface';
import { labelsUpdate } from '../../features/label/actions';
import {onFilterLabel} from "../../utils/Util";
import {useHistory} from "react-router-dom";
import {PlusCircleTwoTone} from "@ant-design/icons/lib";

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
  mode: string;
  transaction: Transaction;
  project: Project | undefined;
  group: Group | undefined;
};

interface TransactionEditFormProps {
  updateExpandedMyself: (updateSettings: boolean) => void;
  patchTransaction: (
    transactionId: number,
    amount: number,
    name: string,
    payer: string,
    date: string,
    time: string,
    transactionType: number,
    timezone: string,
    labels?: number[]
  ) => void;
  currency: string;
  myself: string;
  labelOptions: Label[];
  labelsUpdate: (projectId: number | undefined) => void;
}

const EditTransaction: React.FC<
  RouteComponentProps & TransactionProps & TransactionEditFormProps
> = (props) => {
  const { mode, transaction } = props;
  const [form] = Form.useForm();
  const history = useHistory();
  const [visible, setVisible] = useState(false);

  const [transactionName, setTransactionName] = useState(transaction.name);
  const [payerName, setPayerName] = useState(transaction.payer.name);
  const [amount, setAmount] = useState(transaction.amount);
  const [transactionType, setTransactionType] = useState(
    transaction.transactionType
  );
  const [transTimezone, setTransTimezone] = useState(transaction.timezone);
  const { projectId } = useParams();

  useEffect(() => {
    if (projectId) {
      props.labelsUpdate(parseInt(projectId));
    }
  }, [projectId]);

  const editTransaction = (values: any) => {
    //convert time object to format string
    const date_value = values.date
      ? values.date.format(dateFormat)
      : transaction.date;
    const time_value = values.time ? values.time.format('HH:mm') : undefined;

    props.patchTransaction(
      transaction.id,
      values.amount,
      values.transactionName,
      values.payerName,
      date_value,
      time_value,
      values.transactionType,
      values.timezone,
      values.labels
    );
    setVisible(false);
  };

  const onCancel = () => {
    form.resetFields();
    setVisible(false);
  };
  const openModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    props.updateExpandedMyself(true);
  }, []);

  useEffect(() => {
    setTransactionName(props.transaction.name);
    setAmount(props.transaction.amount);
    setTransactionType(props.transaction.transactionType);
    setTransTimezone(props.transaction.timezone);
    setPayerName(props.transaction.payer.name);
  }, [props.transaction]);

  const getSelections = () => {
    if (!props.group || !props.group.users) {
      return null;
    }
    return (
      <Select
        style={{ marginLeft: '-8px' }}
        value={payerName}
        onChange={(e: any) => setPayerName(e)}
      >
        {props.group.users
          .filter((u) => u.accepted)
          .map((user) => {
            return (
              <Option value={user.name} key={user.name}>
                <Avatar size='small' src={user.avatar} />
                &nbsp;&nbsp; <strong>{user.alias}</strong>
              </Option>
            );
          })}
      </Select>
    );
  };

  const getModal = () => {
    const { transaction } = props;
    return (
      <Modal
        destroyOnClose
        centered
        title='Edit Transaction'
        visible={visible}
        okText='Confirm'
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values);
              form.resetFields();
              editTransaction(values);
            })
            .catch((info) => console.log(info));
        }}
      >
        <Form
          form={form}
          labelAlign='left'
          initialValues={{
            transactionName: transactionName,
            payerName: payerName,
            amount: amount,
            transactionType: transactionType,
            timezone: transTimezone,
          }}
        >
          {/* transaction name */}
          <Form.Item
            name='transactionName'
            label='Name'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            rules={[{message: 'Transaction Name must be between 1 and 50 characters', min: 1, max: 50 }]}
          >
            <Input
              allowClear
              placeholder='Enter Transaction Name'
              value={transactionName}
              onChange={(e: any) => setTransactionName(e.target.value)}
            />
          </Form.Item>
          {/* payer name */}
          <Form.Item
            name='payerName'
            label='Payer'
            labelCol={{ span: 4 }}
            style={{ marginLeft: '10px' }}
            wrapperCol={{ span: 20 }}
          >
            {getSelections()}
            {/* amount */}
          </Form.Item>
          <div style={{ display: 'flex' }}>
            <Form.Item
              name='amount'
              label='Amount'
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 8 }}
            >
              <InputNumber
                value={amount}
                onChange={(e: any) => setAmount(e)}
                style={{ width: 160 }}
                formatter={(value) =>
                  `${LocaleCurrency.getCurrency(props.currency)} ${value}`
                }
                parser={(value) => {
                  return value ? value.replace(/^[A-Za-z]+\s?/g, '') : 0;
                }}
              />
            </Form.Item>

            <Form.Item
              name='transactionType'
              style={{ marginLeft: 15 }}
              colon={false}
            >
              <Radio.Group
                value={transactionType}
                onChange={(e: any) => setTransactionType(e.target.value)}
              >
                <Radio value={0}>Income</Radio>
                <Radio value={1}>Expense</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div style={{ display: 'flex' }}>
            <Tooltip title='Select Date' placement='left'>
              <Form.Item name='date'>
                <DatePicker
                  placeholder='Select Date'
                  defaultValue={
                    transaction.date
                      ? moment(transaction.date, dateFormat)
                      : undefined
                  }
                />
              </Form.Item>
            </Tooltip>

            <Tooltip title='Select Time' placement='right'>
              <Form.Item name='time' style={{ width: '100px' }}>
                <TimePicker
                  allowClear
                  format='HH:mm'
                  placeholder='Select Time'
                  defaultValue={
                    transaction.time
                      ? moment(transaction.time, 'HH:mm')
                      : undefined
                  }
                />
              </Form.Item>
            </Tooltip>

            <Tooltip title='Time Zone'>
              <Form.Item name='timezone'>
                <Select
                  value={transTimezone}
                  onChange={(e: any) => setTransTimezone(e)}
                  showSearch={true}
                  placeholder='Select Time Zone'
                  defaultValue={transaction.timezone}
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
            </Tooltip>
          </div>
          {/* label */}
          <div>
            <Form.Item name="labels" label={
              <Tooltip title="Click to go to labels page to create label">
                <span style={{cursor: 'pointer'}} onClick={() => history.push('/labels')}>
                  Labels&nbsp;<PlusCircleTwoTone />
                </span>
              </Tooltip>
            }>
              <Select
                mode='multiple'
                filterOption={(e, t) => onFilterLabel(e, t)}
                defaultValue={transaction.labels.map((l) => {
                  return l.id;
                })}
              >
                {props.labelOptions &&
                  props.labelOptions.length &&
                  props.labelOptions.map((l) => {
                    return (
                      <Option value={l.id} key={l.value}>
                        {getIcon(l.icon)} &nbsp;{l.value}
                      </Option>
                    );
                  })}
              </Select>
            </Form.Item>
          </div>
        </Form>
      </Modal>
    );
  };

  if (mode === 'div') {
    return (
      <>
        <div className='popover-control-item' onClick={openModal}>
          <span>Edit</span>
          <EditTwoTone />
        </div>
        {getModal()}
      </>
    );
  }

  return (
    <>
      <Tooltip placement='top' title='EditTransaction'>
        <div>
          <EditTwoTone onClick={openModal} />
        </div>
      </Tooltip>
      {getModal()}
    </>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  group: state.group.group,
  currency: state.settings.currency,
  labelOptions: state.label.labelOptions,
  myself: state.myself.username,
});

export default connect(mapStateToProps, {
  updateExpandedMyself,
  patchTransaction,
  labelsUpdate,
})(withRouter(EditTransaction));
