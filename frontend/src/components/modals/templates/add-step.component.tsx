import React, {useState} from 'react';
import {Form, Input, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {createStep} from "../../../features/templates/actions";

type AddStepProps = {
    createStep: (name: string, nextStepId: number | undefined) => void;
};

const AddStep: React.FC<AddStepProps> = (props) => {
    const {createStep} = props;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const addStep = (values: any) => {
        createStep(values.name, values.nextStepId);
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
                title='Create New Step'
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
                            addStep(values);
                        })
                        .catch((info) => console.log(info));
                }}
            >
                <Form form={form}>
                    <Form.Item
                        name='name'
                        rules={[{required: true, message: 'Name must be between 1 and 30 characters', min: 1, max: 30}]}
                    >
                        <Input placeholder='Enter Step Name' allowClear/>
                    </Form.Item>
                    <Form.Item
                        name='nextStepId'
                    >
                        <Input placeholder='Enter NextStepId' allowClear/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    return (
        <>
            <FloatButton
                tooltip="Add New Step"
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
    createStep
})(AddStep);
