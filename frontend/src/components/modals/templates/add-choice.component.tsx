import React, {useState} from 'react';
import {Form, Input, Modal, Radio} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {Button as FloatButton, darkColors, lightColors} from "react-floating-action-button";
import {addChoice} from "../../../features/templates/actions";

type AddChoiceProps = {
    addChoice: (name: string, multiple: boolean) => void;
};

const AddChoice: React.FC<AddChoiceProps> = (props) => {
    const {addChoice} = props;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [multiple, setMultiple] = useState(true);

    const createChoice = (values: any) => {
        addChoice(values.name, multiple);
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
                        <Input placeholder='Enter Choice Name' allowClear/>
                    </Form.Item>
                    <Radio.Group value={multiple} onChange={(e) => setMultiple(e.target.value)}>
                        <Radio value={true}>Multiple Selections</Radio>
                        <Radio value={false}>Single Selection</Radio>
                    </Radio.Group>
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
    addChoice
})(AddChoice);
