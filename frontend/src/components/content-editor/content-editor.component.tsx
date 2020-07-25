// a editor component for taking and update note
import React, { useState } from 'react';
import { Form, Button, message } from 'antd';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import EditorToolbar, { modules, formats } from "./content-editor-toolbar";
import {
  createContent as createNoteContent,
  patchContent as patchNoteContent,
} from '../../features/notes/actions';
import {
  createContent as createTaskContent,
  patchContent as patchTaskContent,
} from '../../features/tasks/actions';
import {
  createContent as createTransactionContent,
  patchContent as patchTransactionContent,
} from '../../features/transactions/actions';
import { Content } from '../../features/myBuJo/interface';
import { ContentType } from '../../features/myBuJo/constants';

import axios from 'axios';

type ContentEditorProps = {
  projectItemId: number;
  content?: Content;
  contentType: ContentType;
};

interface ContentEditorHandler {
  createNoteContent: (noteId: number, text: string) => void;
  patchNoteContent: (noteId: number, contentId: number, text: string) => void;
  createTaskContent: (taskId: number, text: string) => void;
  patchTaskContent: (taskId: number, contentId: number, text: string) => void;
  createTransactionContent: (transactionId: number, text: string) => void;
  patchTransactionContent: (
    transactionId: number,
    contentId: number,
    text: string
  ) => void;
  afterFinish: Function;
}

const ContentEditor: React.FC<ContentEditorProps & ContentEditorHandler> = ({
  projectItemId,
  content,
  createNoteContent,
  patchNoteContent,
  afterFinish,
  contentType,
  createTaskContent,
  createTransactionContent,
  patchTransactionContent,
  patchTaskContent,
}) => {
  // get hook of form from ant form
  const [form] = Form.useForm();
  const isEdit = !!content;
  const [editorContent, setEditorContent] = useState(content ? JSON.parse(content.text) : undefined);

  //general create content function
  const createContentCall: { [key in ContentType]: Function } = {
    [ContentType.NOTE]: createNoteContent,
    [ContentType.TASK]: createTaskContent,
    [ContentType.TRANSACTION]: createTransactionContent,
    [ContentType.PROJECT]: () => {},
    [ContentType.GROUP]: () => {},
    [ContentType.LABEL]: () => {},
    [ContentType.CONTENT]: () => {},
  };
  let createContentFunction = createContentCall[contentType];

  //general patch content function
  const patchContentCall: { [key in ContentType]: Function } = {
    [ContentType.NOTE]: patchNoteContent,
    [ContentType.TASK]: patchTaskContent,
    [ContentType.TRANSACTION]: patchTransactionContent,
    [ContentType.PROJECT]: () => {},
    [ContentType.GROUP]: () => {},
    [ContentType.LABEL]: () => {},
    [ContentType.CONTENT]: () => {},
  };
  let patchContentFunction = patchContentCall[contentType];

  const handleFormSubmit = () => {
    if (!isEdit) {
      form
        .validateFields()
        .then(async () => {
          await createContentFunction(
            projectItemId,
            JSON.stringify(editorContent)
          );
          afterFinish();
        })
        .catch((err) => message.error(err));
    } else {
      content &&
        form
          .validateFields()
          .then(async () => {
            await patchContentFunction(
              projectItemId,
              content.id,
              JSON.stringify(editorContent)
            );
            afterFinish();
          })
          .catch((err) => message.error(err));
    }
  };

  const handleChange = (content: string, delta: any, source: any, editor: any) => {
    setEditorContent(editor.getContents());
  };

  const validateFile = (file: File) => {
    return file.size < 20 * 1024 * 1024; //20MB
  };

  const handleUpload = (param: any) => {
    const formdata = new FormData();
    formdata.append('file', param.file);
    const uploadConfig = {
      onUploadProgress: function (progressEvent: any) {
        let percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        param.progress(percentCompleted);
      },
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };

    axios
      .post('/api/uploadFile', formdata, uploadConfig)
      .then((res) => {
        console.log(res.data);
        param.success({
          url: res.data,
          meta: {
            id: 'xxx',
            title: param.file.name,
            alt: '',
            loop: true,
            autoPlay: false,
            controls: true,
            poster: 'http://xxx/xx.png',
          },
        });
      })
      .catch((err) => {
        param.error({
          msg: err.message,
        });
      });
  };

  return (
    <Form
      form={form}
      onFinish={handleFormSubmit}
    >
      <Form.Item>
        <div className='content-editor'>
          <EditorToolbar />
          <ReactQuill
            theme='snow'
            defaultValue={editorContent}
            onChange={handleChange}
            modules={modules}
            formats={formats}
          />
        </div>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          {isEdit ? 'Update' : 'Create'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default connect(null, {
  createNoteContent,
  patchNoteContent,
  createTaskContent,
  patchTaskContent,
  createTransactionContent,
  patchTransactionContent,
})(ContentEditor);
