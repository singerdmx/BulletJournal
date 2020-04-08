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
      type: 'dropdown',
      title: '这是一个自定义的下拉组件', // 指定鼠标悬停提示文案
      className: 'my-dropdown', // 指定下拉组件容器的样式名
      html: null, // 指定在按钮中渲染的html字符串
      text: 'Upload', // 指定按钮文字，此处可传入jsx，若已指定html，则text不会显示
      showArrow: true, // 指定是否显示下拉组件顶部的小三角形
      arrowActive: false, // 指定是否高亮下拉组件顶部的小三角形
      autoHide: true, // 指定是否在失去焦点时自动隐藏下拉组件
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
