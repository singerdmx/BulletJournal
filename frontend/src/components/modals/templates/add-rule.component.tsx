import React, {useState} from 'react';
import {Form, Input, InputNumber, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {createRule} from "../../../features/templates/actions";
import {Category, Step} from "../../../features/templates/interface";

type AddRuleProps = {
    step: Step | undefined;
    category: Category | undefined;
    createRule: (name: string, priority: number,
                 ruleExpression: string, categoryId?: number, stepId?: number) => void;
};

const AddRule: React.FC<AddRuleProps> = (props) => {
    const {createRule, step, category} = props;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const addRule = (values: any) => {
        //createStep(values.name, values.nextStepId);
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
                title='Create New Rule'
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
                            addRule(values);
                        })
                        .catch((info) => console.log(info));
                }}
            >
                <Form form={form}>
                    <Form.Item
                        name='name'
                        rules={[{required: true, message: 'Name must be between 1 and 30 characters', min: 1, max: 30}]}
                    >
                        <Input placeholder='Rule Name' allowClear/>
                    </Form.Item>
                    <Form.Item
                        name='priority'
                        rules={[{required: true}]}
                    >
                        <InputNumber placeholder='Priority'/>
                    </Form.Item>
                    <Form.Item
                        name='stepId'
                    >
                        <InputNumber placeholder='Step ID'/>
                    </Form.Item>
                    <Form.Item
                        name='categoryId'
                    >
                        <InputNumber placeholder='Category ID'/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    return (
        <>
            <FloatButton
                tooltip="Add New Rule"
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
    createRule
})(AddRule);
