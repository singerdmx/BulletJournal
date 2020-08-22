import React, {useState} from 'react';
import {Form, Input, Modal} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {useParams} from 'react-router';
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {useHistory} from "react-router-dom";
import {addCategory} from "../../../features/templates/actions";

type AddCategoryProps = {
    addCategory: (name: string, description: string) => void;
};

const AddCategory: React.FC<AddCategoryProps> = (props) => {
    const {addCategory} = props;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const history = useHistory();
    const {projectId} = useParams();

    const createCategory = (values: any) => {
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
                title='Create New Category'
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
                            createCategory(values);
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
        <Container>
            <FloatButton
                tooltip="Add New Category"
                onClick={openModal}
                styles={{backgroundColor: darkColors.grey, color: lightColors.white}}
            >
                <PlusOutlined/>
            </FloatButton>
            {getModal()}
        </Container>
    );
};

export default connect(null, {
    addCategory
})(AddCategory);
