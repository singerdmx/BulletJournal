import React, { useState } from 'react';
import { Modal, Input, Tooltip, Form, DatePicker, Select, Avatar } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router';
import { createTransaction } from '../../features/transactions/actions';
import { IState } from '../../store';
import { Project } from '../../features/project/interface';
import { Group } from '../../features/group/interface';
import './modals.styles.less';
const { Option } = Select;

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
    time: string,
    transactionType: number
  ) => void;
}

const AddTransaction: React.FC<RouteComponentProps &
  TransactionProps &
  TransactionCreateFormProps> = props => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const addTransaction = (values: any) => {
    // props.createTransaction(props.projectId, values.transactionName);
    setVisible(false);
  };
  const onCancel = () => setVisible(false);
  const openModal = () => {
    setVisible(true);
  };

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
              rules={[
                { required: true, message: 'Please input Transaction Name!' }
              ]}
            >
              <Input placeholder='Enter Transaction Name' allowClear />
            </Form.Item>

            <Form.Item
              name='payerName'
              rules={[{ required: true, message: 'Please input payer Name!' }]}
            >
              {!props.group.users ? null : (
                <Select defaultValue={props.group.users[0].name}>
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

            <Form.Item
              name='ammount'
              rules={[{ required: true, message: 'Please input ammount!' }]}
            >
              <Input placeholder='Enter ammount' allowClear />
            </Form.Item>

            <Form.Item
              name='Date'
              rules={[{ required: true, message: 'Please input Date!' }]}
            >
              <DatePicker />
            </Form.Item>

            <Form.Item
              name='time'
              rules={[{ required: true, message: 'Please input time!' }]}
            >
              <Input placeholder='Enter time' allowClear />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Tooltip>
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  group: state.group.group
});

export default connect(mapStateToProps, { createTransaction })(
  withRouter(AddTransaction)
);
