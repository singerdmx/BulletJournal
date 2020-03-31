// a editor component for taking and update note
import React from 'react';
import { Form, Button } from 'antd';
import { connect } from 'react-redux';
import BraftEditor from 'braft-editor';
import { createContent } from '../../features/notes/actions';
import { Content } from '../../features/myBuJo/interface';

type NoteEditorProps = {
  noteId: number;
  content?: Content;
};

interface NoteEditorHandler {
  createContent: (noteId: number, text: string) => void;
  afterFinish: () => void;
}

const NoteEditor: React.FC<NoteEditorProps & NoteEditorHandler> = ({
  noteId,
  content,
  createContent,
  afterFinish
}) => {
  // get hook of form from ant form
  const [form] = Form.useForm();
  const isEdit = !!content;

  const handleFormSubmit = () => {
    if (!isEdit) {
      form.validateFields().then(async values => {
        await createContent(noteId, values.noteContent.toRAW());
        afterFinish();
      });
    } else {
      return;
    }
  };
  return (
    <Form form={form} onFinish={handleFormSubmit}>
      <Form.Item name="noteContent">
        <BraftEditor language="en" className="note-editor" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(null, { createContent })(NoteEditor);
