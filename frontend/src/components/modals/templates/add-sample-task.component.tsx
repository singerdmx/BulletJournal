import React, {useState} from 'react';
import {Form, Input, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {addSampleTask} from "../../../features/templates/actions";

type AddSampleTaskProps = {
    addSampleTask: (name: string, uid: string, content: string, metadata: string) => void;
};

const AddSampleTask: React.FC<AddSampleTaskProps> = (props) => {
    const {addSampleTask} = props;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const createTask = (values: any) => {
        addSampleTask(values.name, values.uid, '', values.metadata);
        setVisible(false);
    };

    const onCancel = () => {
        setVisible(false);
        form.resetFields();
    };
    const openModal = () => {
        setVisible(true);
    };
    const getModal = () => {
        return (
            <Modal
                title='Create New Sample Task'
                centered
                visible={visible}
                okText='Create'
                onCancel={onCancel}
                onOk={() => {
                    form
                        .validateFields()
                        .then((values) => {
                            console.log(values);
                            form.resetFields();
                            createTask(values);
                        })
                        .catch((info) => console.log(info));
                }}
            >
                <Form form={form}>
                    <Form.Item
                        name='name'
                        rules={[{required: true, message: 'Name must be between 1 and 30 characters', min: 1, max: 30}]}
                    >
                        <Input placeholder='Enter Sample Task Name' allowClear/>
                    </Form.Item>
                    <Form.Item
                        name='uid'
                        rules={[{required: true, message: 'Metadata must be between 1 and 30 characters', min: 1, max: 30}]}
                    >
                        <Input placeholder='Enter UID' allowClear/>
                    </Form.Item>
                    <Form.Item
                        name='metadata'
                        rules={[{required: true, message: 'Metadata must be between 1 and 3000 characters', min: 1, max: 3000}]}
                    >
                        <Input placeholder='Enter Metadata' allowClear/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    return (
        <>
            <FloatButton
                tooltip="Add New Sample Task"
                onClick={openModal}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
                <PlusOutlined/>
            </FloatButton>
            {getModal()}
        </>
    );
};

export default connect(null, {
    addSampleTask
})(AddSampleTask);
