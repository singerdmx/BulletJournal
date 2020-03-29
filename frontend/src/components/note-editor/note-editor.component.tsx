import React, { useState } from 'react';
import { Form, Button } from 'antd';
import BraftEditor, { BuiltInControlType } from 'braft-editor';

const NoteEditor = () => {
  const [form] = Form.useForm();
  const noteControls = [
    'undo',
    'bold',
    'italic',
    'underline',
    'text-color',
    'separator',
    'headings',
    'list-ul',
    'list-ol',
    'emoji',
    'link',
    'separator',
    'media',
    'fullscreen'
  ] as BuiltInControlType[];

  return (
    <Form form={form}>
      <Form.Item name="noteContent">
        <BraftEditor
          controls={noteControls}
          language="en"
          className="note-editor"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default NoteEditor;
