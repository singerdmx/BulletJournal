import React from 'react';
import { Form, Button } from 'antd';
import BraftEditor from 'braft-editor';

const NoteEditor = () => {
  const [form] = Form.useForm();
  return (
    <Form form={form}>
      <Form.Item name="noteContent">
        <BraftEditor language="en" className="note-editor" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NoteEditor;
