import React, {useState} from 'react';
import { Form, Input, Modal, Select, Tooltip, Button, InputNumber } from 'antd';
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

const {TextArea} = Input;
const {Option} = Select;

type Props = {
  bankAccount: BankAccount;
  updateBankAccount: (
    id: number,
    name: string,
    accountType: BankAccountType,
    accountNumber?: string,
    description?: string
  ) => void;
};

const EditBankAccountModal: React.FC<Props> = (props) => {
  
  const bankAccount = props.bankAccount;
  console.log(bankAccount);
  console.log(bankAccount.name);
  const [name, setName] = useState<string>(bankAccount.name);
  const [accountType, setAccountType] = useState<string>(bankAccount.accountType);
  const [accountNumber, setAccountNumber] = useState<number | undefined>(
    bankAccount.accountNumber ? parseInt(bankAccount?.accountNumber) : undefined);
  const [description, setDescription] = useState<string | undefined>(bankAccount.description);
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
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
    setVisible(false);
  }

  const onChangeName = (name: string) => {
    setName(name);
  };

  const onChangeAccountType = (accountType: string) => {
    setAccountType(accountType);
  };

  const onChangeAccountNumber = (accountNumber: number | undefined) => {
    setAccountNumber(accountNumber);
  };

  const onChangeDescription = (description: string) => {
    setDescription(description);
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
                  description: description
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
                <InputNumber
                    placeholder="Enter Account Number (Last 4 digits)"
                    value={accountNumber}
                    onChange={(e) => onChangeAccountNumber(e)}
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
            </Form.Item>
          </Form>
        </Modal>
    );
  };

  const getDiv = () => (
    <div className='edit-bank-account-button'>
        <EditOutlined key='Edit' title='Edit' onClick={openModal}/>
        {getModal()}
    </div>
  )

  return getDiv();
};

export default connect(null, {updateBankAccount})(
  EditBankAccountModal
);
