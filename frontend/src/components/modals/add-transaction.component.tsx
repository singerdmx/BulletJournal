import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  TimePicker,
  Tooltip,
} from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter, useParams } from 'react-router';
import {
  createTransaction,
  updateTransactionVisible,
} from '../../features/transactions/actions';
import { IState } from '../../store';
import { Project } from '../../features/project/interface';
import { Group } from '../../features/group/interface';
import './modals.styles.less';
import { updateExpandedMyself } from '../../features/myself/actions';
import { zones } from '../settings/constants';
import { dateFormat } from '../../features/myBuJo/constants';
import { getIcon } from '../draggable-labels/draggable-label-list.component';
import { labelsUpdate } from '../../features/label/actions';
import { Label } from '../../features/label/interface';
import {onFilterLabel} from "../../utils/Util";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
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
  project: Project | undefined;
  group: Group | undefined;
};

interface TransactionCreateFormProps {
  mode: string;
  createTransaction: (
    projectId: number,
    amount: number,
    name: string,
    payer: string,
    date: string,
    transactionType: number,
    timezone: string,
    labels: number[],
    time: string
  ) => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
  currency: string;
  timezone: string;
  myself: string;
  updateTransactionVisible: (visible: boolean) => void;
  addTransactionVisible: boolean;
  labelsUpdate: (projectId: number | undefined) => void;
  labelOptions: Label[];
}

const AddTransaction: React.FC<
  RouteComponentProps & TransactionProps & TransactionCreateFormProps
> = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [timeVisible, setTimeVisible] = useState(false);
  const { projectId } = useParams();

  const addTransaction = (values: any) => {
    //convert time object to format string
    const date_value = values.date.format(dateFormat);
    const time_value = values.time ? values.time.format('HH:mm') : undefined;
    const payerName = values.payerName ? values.payerName : props.myself;
    const timezone = values.timezone ? values.timezone : props.timezone;
    if (props.project) {
      props.createTransaction(
        props.project.id,
        values.amount,
        values.transactionName,
        payerName,
        date_value,
        values.transactionType,
        timezone,
        values.labels,
        time_value
      );
    }
    props.updateTransactionVisible(false);
  };
  const onCancel = () => props.updateTransactionVisible(false);
  const openModal = () => {
    props.updateTransactionVisible(true);
  };

  useEffect(() => {
    props.updateExpandedMyself(true);
  }, []);

  useEffect(() => {
    if (projectId) {
      props.labelsUpdate(parseInt(projectId));
    }
  }, []);

  const getSelections = () => {
    if (!props.group || !props.group.users) {
      return null;
    }
    return (
      <Select defaultValue={props.myself} style={{ marginLeft: '-8px' }}>
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
    return (
      <Modal
        destroyOnClose
        centered
        title='Create New Transaction'
        visible={props.addTransactionVisible}
        okText='Create'
        onCancel={onCancel}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              console.log(values);
              form.resetFields();
              addTransaction(values);
            })
            .catch((info) => console.log(info));
        }}
      >
        <Form form={form} labelAlign='left'>
          <Form.Item
            name='transactionName'
            label='Name'
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            rules={[{ required: true, message: 'Transaction Name must be between 1 and 50 characters', min: 1, max: 50 }]}
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
            {getSelections()}
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
              rules={[{ required: true, message: 'Missing Type!' }]}
            >
              <Radio.Group>
                <Radio value={0}>Income</Radio>
                <Radio value={1}>Expense</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <div style={{ display: 'flex' }}>
            <Tooltip title='Select Date' placement='left'>
              <Form.Item
                name='date'
                rules={[{ required: true, message: 'Missing Date!' }]}
              >
                <DatePicker
                  placeholder='Select Date'
                  onChange={(value) => setTimeVisible(value !== null)}
                />
              </Form.Item>
            </Tooltip>

            {timeVisible && (
              <Tooltip title='Select Time' placement='right'>
                <Form.Item name='time' style={{ width: '100px' }}>
                  <TimePicker
                    allowClear
                    format='HH:mm'
                    placeholder='Select Time'
                  />
                </Form.Item>
              </Tooltip>
            )}

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
                  filterOption={(e, t) => onFilterLabel(e, t)}>
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

  if (props.mode === 'button') {
    return (
      <div className='add-transaction'>
        <Button type='primary' onClick={openModal}>
          Create New Transaction
        </Button>
        {getModal()}
      </div>
    );
  }

  return (
      <Container>
        <FloatButton
            tooltip="Add New Transaction"
            onClick={openModal}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
        >
          <PlusOutlined/>
        </FloatButton>
        {getModal()}
      </Container>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  group: state.group.group,
  currency: state.settings.currency,
  timezone: state.settings.timezone,
  myself: state.myself.username,
  addTransactionVisible: state.transaction.addTransactionVisible,
  labelOptions: state.label.labelOptions,
});

export default connect(mapStateToProps, {
  createTransaction,
  updateExpandedMyself,
  updateTransactionVisible,
  labelsUpdate,
})(withRouter(AddTransaction));
