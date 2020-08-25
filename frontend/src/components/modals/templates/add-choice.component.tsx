import React, {useState} from 'react';
import {Form, Input, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {addCategory} from "../../../features/templates/actions";

type AddChoiceProps = {
    addCategory: (name: string, description: string) => void;
};

const AddChoice: React.FC<AddChoiceProps> = (props) => {
    const {addCategory} = props;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);

    const createChoice = (values: any) => {
        addCategory(values.name, values.description);
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
                title='Create New Choice'
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
                            createChoice(values);
                        })
                        .catch((info) => console.log(info));
                }}
            >
                <Form form={form}>
                    <Form.Item
                        name='name'
                        rules={[{required: true, message: 'Name must be between 1 and 30 characters', min: 1, max: 30}]}
                    >
                        <Input placeholder='Enter Category Name' allowClear/>
                    </Form.Item>
                    <Form.Item
                        name='description'
                    >
                        <Input placeholder='Enter Description' allowClear/>
                    </Form.Item>
                </Form>
            </Modal>
        );
    };

    return (
        <>
            <FloatButton
                tooltip="Add New Choice"
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
    addCategory
})(AddChoice);
