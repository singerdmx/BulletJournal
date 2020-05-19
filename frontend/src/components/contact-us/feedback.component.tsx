import React from "react";
import {Button, Form, Input} from "antd";

type FeedbackProps = {};

const Feedback: React.FC<FeedbackProps> = ({}) => {
    const [form] = Form.useForm();
    const onReset = () => {
        form.resetFields();
    };
    const onSubmit = () => {
        form
            .validateFields()
            .then((values) => {
                console.log(values);
                form.resetFields();
            })
            .catch((info) => console.log(info));
    };

    const layout = {
        labelCol: { span: 4 },
        wrapperCol: { span: 16 },
    };
    const tailLayout = {
        wrapperCol: { offset: 4, span: 16 },
    };

    return <Form {...layout} form={form}>
        <Form.Item name="title" label="Title" rules={[{required: true}]}>
            <Input/>
        </Form.Item>
        <Form.Item name="content" label="Content" rules={[{required: true}]}>
            <Input.TextArea/>
        </Form.Item>
        <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" onClick={onSubmit}>
                Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
                Reset
            </Button>
        </Form.Item>
    </Form>
};

export default Feedback;