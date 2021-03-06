import React, {useEffect, useState} from 'react';
import {Button, Form, Input, InputNumber, Modal, Select, Tooltip} from 'antd';
import {BankOutlined, CreditCardOutlined, DollarCircleOutlined, PlusCircleFilled} from '@ant-design/icons';
import {connect} from 'react-redux';
import './modals.styles.less';
import {BankAccount, BankAccountType} from '../../features/transactions/interface';
import {addBankAccount} from '../../features/myself/actions';
import {useHistory} from 'react-router-dom';
import {getBankAccountType} from '../settings/bank-account';
import {IState} from "../../store";

const {TextArea} = Input;
const {Option} = Select;

type Props = {
  bankAccounts: BankAccount[];
  addBankAccount: (
      name: string,
      accountType: BankAccountType,
      onSuccess: (bankAccountId: number) => void,
      accountNumber?: string,
      description?: string
  ) => void;
};

const AddBankAccountModal: React.FC<Props> = (props) => {
  const [name, setName] = useState<string>('');
  const [accountType, setAccountType] = useState<string>('');
  const [accountNumber, setAccountNumber] = useState<string | undefined>(undefined);
  const [description, setDescription] = useState<string>('');
  const [visible, setVisible] = useState(false);

  const [form] = Form.useForm();
  const onCancel = () => {
    setVisible(false);
    form.resetFields();
  };
  const openModal = () => {
    setVisible(true);
  };

  useEffect(() => {
    setVisible(props.bankAccounts.length === 0);
  }, [props.bankAccounts]);

  const history = useHistory();
  const addBankAccount = () => {
    let type: BankAccountType = getBankAccountType(accountType);
    props.addBankAccount(name, type, (id) => (console.log(`/bank/${id}`)), accountNumber?.toString(), description);
    setVisible(false);
    setName('');
    setDescription('');
    setAccountNumber(undefined);
    setAccountType(BankAccountType.CHECKING_ACCOUNT);
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

  const getModal = () => {
    return (
        <Modal
            title="Add New Bank Account"
            destroyOnClose
            centered
            okText="Create"
            visible={visible}
            onCancel={onCancel}
            onOk={() => {
              form
                  .validateFields()
                  .then((values) => {
                    form.resetFields();
                    addBankAccount();
                  })
                  .catch((info) => console.log(info));
            }}
        >
          <Form form={form}>
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
              <Form.Item name="Description">
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
      <div className='add-bank-account-button'>
        <Tooltip placement='bottom' title='Add New Bank Account'>
          <Button type="primary" shape="round" icon={<PlusCircleFilled/>} onClick={openModal}>
            Add
          </Button>
        </Tooltip>
        {getModal()}
      </div>
  )

  return getDiv();
};

const mapStateToProps = (state: IState) => ({
  bankAccounts: state.myself.bankAccounts,
});

export default connect(mapStateToProps, {addBankAccount})(
    AddBankAccountModal
);
