import React, {useEffect, useState} from 'react';
import {
  Avatar,
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  InputNumber,
  Modal,
  Radio,
  Select,
  TimePicker,
  Tooltip,
} from 'antd';
import {PlusOutlined, SyncOutlined, EnvironmentOutlined, BankOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {RouteComponentProps, useParams, withRouter} from 'react-router';
import {
  createTransaction,
  updateRecurringTransactions,
  updateTransactionVisible,
} from '../../features/transactions/actions';
import ReactRRuleGenerator from '../../features/recurrence/RRuleGenerator';
import {convertToTextWithRRule,} from '../../features/recurrence/actions';
import {IState} from '../../store';
import {Project} from '../../features/project/interface';
import {Group} from '../../features/group/interface';
import './modals.styles.less';
import {updateExpandedMyself} from '../../features/myself/actions';
import {zones} from '../settings/constants';
import {dateFormat} from '../../features/myBuJo/constants';
import {getIcon} from '../draggable-labels/draggable-label-list.component';
import {labelsUpdate} from '../../features/label/actions';
import {Label} from '../../features/label/interface';
import {onFilterLabel} from "../../utils/Util";
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {useHistory} from "react-router-dom";
import {PlusCircleTwoTone} from "@ant-design/icons/lib";
import ProjectSettingDialog from "../../components/modals/project-setting.component";
import {BankAccount, Transaction} from "../../features/transactions/interface";
import {ProjectItemUIType} from "../../features/project/constants";
import TransactionItem from "../project-item/transaction-item.component";
import SearchBar from '../map-search-bar/search-bar.component';
import BankAccountElem from "../settings/bank-account";


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
  myself: string;
  recurringTransactions: Transaction[];
  updateRecurringTransactions: (projectId: number) => void;
};

interface TransactionCreateFormProps {
  mode: string;
  createTransaction: (
    projectId: number,
    amount: number,
    name: string,
    payer: string,
    transactionType: number,
    timezone: string,
    location: string,
    labels: number[],
    date?: string,
    time?: string,
    recurrenceRule?: string,
    bankAccountId?: number,
    onSuccess?: Function
  ) => void;
  updateExpandedMyself: (updateSettings: boolean) => void;
  currency: string;
  timezone: string;
  myself: string;
  bankAccounts: BankAccount[];
  updateTransactionVisible: (visible: boolean) => void;
  addTransactionVisible: boolean;
  labelsUpdate: (projectId: number | undefined) => void;
  labelOptions: Label[];
  rRuleString: any;
}

const AddTransaction: React.FC<
  RouteComponentProps & TransactionProps & TransactionCreateFormProps
> = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();
  const [manageRecurringTransDialogVisible, setManageRecurringTransDialogVisible] = useState(false);
  const { projectId } = useParams();
  const [recurrent, setRecurrent] = useState(false);
  const [bankAccountVisible, setBankAccountVisible] = useState(true);
  const [location, setLocation] = useState('');

  const addTransaction = (values: any) => {
    //convert time object to format string
    const dateValue = values.date ? values.date.format(dateFormat) : undefined;
    const timeValue = values.time ? values.time.format('HH:mm') : undefined;
    const payerName = values.payerName ? values.payerName : props.myself;
    const timezone = values.timezone ? values.timezone : props.timezone;
    const recurrence = recurrent ? props.rRuleString : undefined;

    if (props.project) {
      props.createTransaction(
        props.project.id,
        values.amount,
        values.transactionName,
        payerName,
        values.transactionType,
        timezone,
        location,
        values.labels,
        dateValue,
        timeValue,
        recurrence,
        values.bankAccountId,
        () => {
          if (recurrence) {
            openManageRecurringTransDialog();
          }
        }
      );
    }
    props.updateTransactionVisible(false);
  };
  const onCancelNewDialogModal = () => props.updateTransactionVisible(false);
  const openNewTranDialogModal = () => {
    props.updateTransactionVisible(true);
  };

  const openManageRecurringTransDialog = () => {
    if (props.project) {
      props.updateRecurringTransactions(props.project.id);
    }
    setManageRecurringTransDialogVisible(true);
  }

  useEffect(() => {
    props.updateExpandedMyself(true);
  }, []);

  useEffect(() => {
    if (projectId) {
      props.labelsUpdate(parseInt(projectId));
    }
  }, []);

  const [rRuleText, setRRuleText] = useState(
    convertToTextWithRRule(props.rRuleString)
  );
  useEffect(() => {
    setRRuleText(convertToTextWithRRule(props.rRuleString));
  }, [props.rRuleString]);

  const getLocationItem = () => {
	return <Form.Item label={<div><EnvironmentOutlined/><span style={{padding: '0 4px'}}>Location</span></div>}>
	  <SearchBar setLocation={setLocation} location={location}/>
	</Form.Item>;
  }

  const getSelections = () => {
    if (!props.group || !props.group.users) {
      return null;
    }
    return (
      <Select defaultValue={props.myself} style={{ marginLeft: '-8px' }} onChange={() => {
        setBankAccountVisible(form.getFieldValue('payerName') === props.myself);
        form.setFields([{ name: 'bankAccountId', value: undefined }]);
      }}>
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

  const getRecurringTransactionsDiv = () => {
    if (props.recurringTransactions.length === 0) {
      return <Empty/>
    }

    return <div>
      {props.recurringTransactions.map((t: Transaction) => <TransactionItem
              transaction={t}
              type={ProjectItemUIType.MANAGE_RECURRING}
              inModal={true}
              inProject={false}
          />
      )}
    </div>
  }

  const getManageRecurringTransactionsModal = () => {
    return (
        <Modal
            destroyOnClose
            centered
            title='Manage Recurring Transactions'
            visible={manageRecurringTransDialogVisible}
            footer={null}
            onCancel={() => setManageRecurringTransDialogVisible(false)}>
          {getRecurringTransactionsDiv()}
        </Modal>
    )
  };

  const getNewTransactionModal = () => {
    return (
      <Modal
        destroyOnClose
        centered
        title='Create New Transaction'
        visible={props.addTransactionVisible}
        okText='Create'
        onCancel={onCancelNewDialogModal}
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
                style={{ width: 150 }}
                parser={(value) => {
                  return value ? value.replace(/^[A-Za-z]+\s?/g, '') : 0;
                }}
              />
            </Form.Item>

            <Form.Item
              name='transactionType'
              style={{ marginLeft: 25 }}
              colon={false}
              rules={[{ required: true, message: 'Missing Type!' }]}
            >
              <Radio.Group>
                <Radio value={0}>Income</Radio>
                <Radio value={1}>Expense</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          {/* transaction type------------------------------------- */}
          <span style={{ color: 'rgba(0, 0, 0, 0.85)' }}>Transaction Type &nbsp;&nbsp;</span>
          <Radio.Group
            defaultValue={recurrent ? 'Recurrent' : 'oneTime'}
            onChange={(e) => setRecurrent(e.target.value === 'Recurrent')}
            buttonStyle="solid"
            style={{ marginBottom: 18 }}
          >
            <Radio.Button value={'oneTime'}>One Time</Radio.Button>
            <Radio.Button value={'Recurrent'}>Recurring</Radio.Button>
          </Radio.Group>

          {recurrent ? (
            <div
              style={{
                borderTop: '1px solid #E8E8E8',
                borderBottom: '1px solid #E8E8E8',
                paddingTop: '24px',
                marginBottom: '24px',
              }}
            >
              <div className="recurrence-title">{rRuleText}</div>
              <ReactRRuleGenerator />
            </div>
          ):
          (
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'flex', flex: 1 }}>
                <Tooltip title="Select Date" placement="left">
                  <Form.Item 
                    name="date" 
                    style={{ width: '100%' }}
                    rules={[{ required: true, message: 'Missing Date!' }]}>
                    <DatePicker
                      allowClear={true}
                      style={{ width: '100%' }}
                      placeholder="Date"
                    />
                  </Form.Item>
                </Tooltip>
                <Tooltip title="Select Time" placement="right">
                  <Form.Item name="time" style={{width: '210px'}}>
                    <TimePicker
                        allowClear={true}
                        format="HH:mm"
                        placeholder="Time"
                    />
                  </Form.Item>
                </Tooltip>
              </div>
            </div>
          )}

          <div style={{ display: 'flex' }}>
            <Tooltip title='Time Zone'>
              <Form.Item name='timezone' label="Time Zone">
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
          {location && location.length > 40 ? <Tooltip title={location} placement="bottom">
            {getLocationItem()}
          </Tooltip> : getLocationItem()}
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
          {/* Bank Account */}
          {bankAccountVisible && <div>
            <Form.Item name="bankAccountId" label={
              <Tooltip title="Click to go to bank page to create bank account">
                <span style={{cursor: 'pointer'}} onClick={() => history.push('/bank')}>
                  Bank Accounts&nbsp;<PlusCircleTwoTone />
                </span>
              </Tooltip>
            }>
              <Select allowClear={true}>
                {props.bankAccounts.map((account) => {
                  return <Option value={account.id} key={account.id}>
                    <BankAccountElem bankAccount={account} mode='dropdown'/>
                  </Option>
                })}
              </Select>
            </Form.Item>
          </div>}
        </Form>
      </Modal>
    );
  };

  if (props.mode === 'button') {
    return (
      <div className='add-transaction'>
        <Button type='primary' onClick={openNewTranDialogModal}>
          Create New Transaction
        </Button>
      </div>
    );
  }

  return (
    <div>
      <Container>
        <FloatButton
            tooltip="Bank Account"
            onClick={() => history.push('/bank')}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
        >
          <BankOutlined />
        </FloatButton>
        <FloatButton
            tooltip="Manage Recurring Transactions"
            onClick={openManageRecurringTransDialog}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
        >
          <SyncOutlined spin />
        </FloatButton>
        {getManageRecurringTransactionsModal()}
        {props.project && props.project.owner.name === props.myself && <ProjectSettingDialog />}
        <FloatButton
            tooltip="Add New Transaction"
            onClick={openNewTranDialogModal}
            styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
        >
          <PlusOutlined/>
        </FloatButton>
        {getNewTransactionModal()}
      </Container>
    </div>
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
  recurringTransactions: state.transaction.recurringTransactions,
  rRuleString: state.rRule.rRuleString,
  bankAccounts: state.myself.bankAccounts,
});

export default connect(mapStateToProps, {
  createTransaction,
  updateExpandedMyself,
  updateTransactionVisible,
  labelsUpdate,
  updateRecurringTransactions
})(withRouter(AddTransaction));
