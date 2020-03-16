import React, {useState} from 'react';
import {Modal, Input, Tooltip, Form} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {withRouter, RouteComponentProps} from 'react-router';
import {createTransaction} from '../../features/transactions/actions';
import {IState} from '../../store';
import './modals.styles.less';

type TransactionProps = {
    projectId: number;
};

interface TransactionCreateFormProps {
    createTransaction: (projectId: number, amount: number, name: string, payer: string,
                        date: string, time: string, transactionType: number) => void;

};

const AddTransaction: React.FC<RouteComponentProps & TransactionProps & TransactionCreateFormProps> = (props) => {
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const addTransaction = (values: any) => {
        // props.createTransaction(props.projectId, values.transactionName);
        setVisible(false);
    };
    const onCancel = () => setVisible(false);
    const openModal = () => setVisible(true);
    return (
        <Tooltip placement="top" title='Create New Transaction'>
            <div className="add-transaction">
                <PlusOutlined style={{fontSize: 20, cursor: 'pointer'}} onClick={openModal} title='Create New Transaction'/>
                <Modal
                    title="Create New Transaction"
                    visible={visible}
                    okText="Create"
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
                            name="transactionName"
                            rules={[
                                {required: true, message: 'Please input Transaction Name!'}
                            ]}
                        >
                            <Input placeholder="Enter Transaction Name" allowClear/>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </Tooltip>
    );
}

const mapStateToProps = (state: IState) => ({
    projectId: state.project.project.id
});

export default connect(mapStateToProps, {createTransaction})(withRouter(AddTransaction));