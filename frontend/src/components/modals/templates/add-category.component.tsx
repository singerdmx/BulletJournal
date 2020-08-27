import React, {useState} from 'react';
import {Col, Form, Input, InputNumber, Modal, Popover, Row} from 'antd';
import {PlusOutlined} from '@ant-design/icons';
import {connect} from 'react-redux';
import {Button as FloatButton, Container, darkColors, lightColors} from "react-floating-action-button";
import {addCategory} from "../../../features/templates/actions";
import {icons} from "../../../assets/icons";
import {QuestionCircleOutlined} from "@ant-design/icons/lib";
import ColorPicker from '../../../utils/color-picker/ColorPickr';
import './add-category.component.styles.less';

type AddCategoryProps = {
    addCategory: (name: string, description?: string, icon?: string, color?: string, forumId?: number, image?: string) => void;
};

const AddCategory: React.FC<AddCategoryProps> = (props) => {
    const {addCategory} = props;
    const [form] = Form.useForm();
    const [visible, setVisible] = useState(false);
    const [color, setColor] = useState('#7fbba0');
    //label form state
    const [formCreateLabelIcon, setFormCreateLabelIcon] = useState(
        <QuestionCircleOutlined/>
    );
    const [formCreateLabelIconString, setCreateFormLabelIconString] = useState(
        'QuestionCircleOutlined'
    );

    const IconsSelector = () => {
        return (
            <div className='label-icon-selector' key='add-category-icon-selector'>
                <Row>
                    {icons.map((icon: any) => {
                        return (
                            <Col span={2} key={icon.name}>
                                <span
                                    title={icon.name}
                                    onClick={() => {
                                        setFormCreateLabelIcon(icon.icon);
                                        setCreateFormLabelIconString(icon.name);
                                    }}
                                >
                                  {icon.icon}
                                </span>
                            </Col>
                        );
                    })}
                </Row>
            </div>
        );
    };

    const createCategory = (values: any) => {
        addCategory(values.name, values.description, formCreateLabelIconString, color, values.forumId, values.image);
        setVisible(false);
    };

    const changeColorHandler = (input: any) => {
        console.log(input);
        setColor(input.color);
    }

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
                key='add-category'
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
                    <Popover
                        title='Select an icon for your category'
                        placement='bottom'
                        content={<IconsSelector />}
                        style={{width: '800px'}}
                    >
                        <div className='label-icon'>{formCreateLabelIcon}</div>
                    </Popover>
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
                    <Form.Item
                        name='image'
                    >
                        <Input placeholder='Enter Image URL'/>
                    </Form.Item>
                    <Form.Item
                        name='forumId'
                    >
                        <InputNumber placeholder='Enter Forum ID' width='200px'/>
                    </Form.Item>
                    <ColorPicker
                        label='Color  '
                        color={color}
                        onChange={changeColorHandler}
                        mode='RGB'
                    />
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
