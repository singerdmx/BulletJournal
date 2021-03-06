import React, {useState} from 'react';
import { Form, Input, Modal, Select, Tooltip, InputNumber } from 'antd';
import {
  CreditCardOutlined,
  DollarCircleOutlined,
  BankOutlined,
  EditOutlined,
} from '@ant-design/icons';
import {connect} from 'react-redux';
import './modals.styles.less';
import { BankAccount, BankAccountType } from '../../features/transactions/interface';
import { updateBankAccount } from '../../features/myself/actions';
import { getBankAccountType } from '../settings/bank-account';
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import bank from '../settings/bank';
import { useEffect } from 'react';
import {changeAccountBalance} from "../../features/transactions/actions";

const {TextArea} = Input;
const {Option} = Select;

type BankProps = {
  bankAccount: BankAccount | undefined;
  mode: string;
  onChangeBalanceSuccess: Function;
  changeAccountBalance: (bankAccount: BankAccount, balance: number, description: string, onSuccess: Function) => void;
  updateBankAccount: (
    id: number,
    name: string,
    accountType: BankAccountType,
    accountNumber?: string,
    description?: string
  ) => void;
};

const EditBankAccountModal: React.FC<BankProps> = (props) => {
  const bankAccount = props.bankAccount;  
  const mode = props.mode;
  const [name, setName] = useState<string>(bankAccount ? bankAccount.name : '');
  const [accountType, setAccountType] = useState<string>(bankAccount ? bankAccount.accountType : '');
  const [accountNumber, setAccountNumber] = useState<string | undefined>(
    bankAccount ? bankAccount.accountNumber : undefined);
  const [description, setDescription] = useState<string | undefined>(bankAccount?.description);
  const [netBalance, setNetBalance] = useState(bankAccount ? bankAccount.netBalance : 0);
  const [visible, setVisible] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setName(bankAccount ? bankAccount.name : '');
    setAccountType(bankAccount ? bankAccount.accountType : '');
    setAccountNumber(bankAccount ? bankAccount.accountNumber : undefined);
    setDescription(bankAccount?.description);
    setNetBalance(bankAccount ? bankAccount.netBalance : 0);
  }, [bankAccount]);

  if (!bankAccount) {
    return null;
  }

  const onCancel = () => {
    setVisible(false);
    form.resetFields();
  };
  const openModal = () => {
    setVisible(true);
  };

  const updateBankAccount = (id: number) => {
    let type: BankAccountType = getBankAccountType(accountType);
    props.updateBankAccount(id, name, type, accountNumber?.toString(), description);
    if (netBalance != bankAccount.netBalance) {
      props.changeAccountBalance(bankAccount, netBalance, '', props.onChangeBalanceSuccess);
    }
    setVisible(false);
  }

  const onChangeName = (name: string) => {
    setName(name);
  };

  const onChangeAccountType = (accountType: string) => {
    setAccountType(accountType);
  };

  const onChangeAccountNumber = (accountNumber: string) => {
    setAccountNumber(accountNumber);
  };

  const onChangeDescription = (description: string) => {
    setDescription(description);
  };

  const onChangeBalance = (balance: number | undefined) => {
    if (balance) {
      setNetBalance(balance);
    }
  };

  const getModal = () => {
    return (
        <Modal
            title="Edit Bank Account"
            destroyOnClose
            centered
            okText="Update"
            visible={visible}
            onCancel={onCancel}
            onOk={() => {
              form
                  .validateFields()
                  .then((values) => {
                    form.resetFields();
                    updateBankAccount(bankAccount.id);
                  })
                  .catch((info) => console.log(info));
            }}
        >
          <Form form={form}
                initialValues={{
                  bankName: name,
                  accountType: accountType,
                  accountNumber: accountNumber,
                  description: description,
                  balance: netBalance
                }}
          >
            <Form.Item>
              <Form.Item
                  name="bankName"
                  rules={[{required: true, message: 'Missing Bank name', min: 1, max: 30}]}
                  style={{display: 'inline-block', width: '60%'}}
              >
                <Input
                    placeholder="Enter Bank Name"
                    value={name}
                    onChange={(e) => onChangeName(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                  name="accountType"
                  rules={[{required: true, message: 'Missing Type'}]}
                  style={{display: 'inline-block', width: '60%'}}
              >
                <Select
                    placeholder="Choose Type"
                    value={accountType ? accountType : undefined}
                    onChange={(e) => onChangeAccountType(e)}
                >
                  <Option value={BankAccountType.CHECKING_ACCOUNT} title="Account Type: CHECKING_ACCOUNT">
                    <DollarCircleOutlined/>
                    &nbsp;CHECKING_ACCOUNT
                  </Option>
                  <Option value={BankAccountType.SAVING_ACCOUNT} title="Account Type: SAVING_ACCOUNT">
                    <BankOutlined/>
                    &nbsp;SAVING_ACCOUNT
                  </Option>
                  <Option value={BankAccountType.CREDIT_CARD} title="Account Type: CREDIT_CARD">
                    <CreditCardOutlined/>
                    &nbsp;CREDIT_CARD
                  </Option>
                </Select>
              </Form.Item>
              <Form.Item
                  name="accountNumber"
                  style={{display: 'inline-block', width: '60%'}}
              >
                <Input
                    placeholder="Enter Account Number (Last 4 digits)"
                    value={accountNumber}
                    onChange={(e) => onChangeAccountNumber(e.target.value)}
                    style={{display: 'inline-block', width: '100%'}}
                />
              </Form.Item>
              <Form.Item name="description">
                <TextArea
                    placeholder="Enter Description"
                    autoSize
                    value={description}
                    onChange={(e) => onChangeDescription(e.target.value)}
                />
              </Form.Item>
              <Form.Item
                  name="balance"
                  label='Current Balance'
                  style={{display: 'inline-block', width: '60%'}}
              >
                <InputNumber
                    value={netBalance}
                    onChange={(e) => onChangeBalance(e)}
                    style={{display: 'inline-block', width: '100%'}}
                />
              </Form.Item>
            </Form.Item>
          </Form>
        </Modal>
    );
  };

  const getDiv = () => {
    switch (mode) {
      case 'card':
        return (
        <>
          <Tooltip title='Edit'>
              <EditOutlined key='Edit' title='Edit' onClick={openModal}/>
          </Tooltip>
          {getModal()}
        </>)
      case 'float': 
        return (
          <>
            <FloatButton
              tooltip="Edit Account Info"
              styles={{backgroundColor: darkColors.grey, color: lightColors.white, fontSize: '25px'}}
              onClick={openModal}
            >
                <EditOutlined />
            </FloatButton>
            {getModal()}
          </>);
      default:
        return <>{getModal()}</>
    }
  }

  return getDiv();
};

export default connect(null, {updateBankAccount, changeAccountBalance})(
  EditBankAccountModal
);
