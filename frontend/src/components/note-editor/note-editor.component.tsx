// a editor component for taking and update note
import React from 'react';
import { Form, Button } from 'antd';
import { connect } from 'react-redux';
import BraftEditor, { ExtendControlType } from 'braft-editor';
import { createContent } from '../../features/notes/actions';
import { Content } from '../../features/myBuJo/interface';
import FileUploader from './editor-uploader.component';

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
  afterFinish,
}) => {
  // get hook of form from ant form
  const [form] = Form.useForm();
  const isEdit = !!content;
  const defaultEditorState = BraftEditor.createEditorState(
    content ? content.text : null
  );
  const handleFormSubmit = () => {
    if (!isEdit) {
      form.validateFields().then(async (values) => {
        await createContent(noteId, values.noteContent.toRAW());
        afterFinish();
      });
    } else {
      return;
    }
  };

  const extendControls: ExtendControlType[] = [
    'separator',
    {
      key: 'my-dropdown',
      type: 'component',
      component: <FileUploader />, // 指定在下拉组件中显示的内容组件
    },
  ];
  return (
    <Form
      form={form}
      onFinish={handleFormSubmit}
      initialValues={{ noteContent: defaultEditorState }}
    >
      <Form.Item name="noteContent">
        <BraftEditor
          language="en"
          className="note-editor"
          extendControls={extendControls}
          excludeControls={['media']}
        />
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
