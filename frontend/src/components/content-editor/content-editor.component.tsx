// a editor component for taking and update note
import React, { useState, useRef, useEffect } from 'react';
import { Form, Button, message } from 'antd';
import { connect } from 'react-redux';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { modules, formats } from './content-editor-toolbar';
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
import placeholder from '../../assets/placeholder.png';
import axios from 'axios';
import './content-editor.style.less';

type ContentEditorProps = {
  projectItemId: number;
  content?: Content;
  contentType: ContentType;
  isOpen: boolean;
};

interface ContentEditorHandler {
  createNoteContent: (noteId: number, text: string) => void;
  patchNoteContent: (noteId: number, contentId: number, text: string, diff?: string) => void;
  createTaskContent: (taskId: number, text: string) => void;
  patchTaskContent: (taskId: number, contentId: number, text: string, diff?: string) => void;
  createTransactionContent: (transactionId: number, text: string) => void;
  patchTransactionContent: (
    transactionId: number,
    contentId: number,
    text: string,
    diff?: string
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
  isOpen,
  createTaskContent,
  createTransactionContent,
  patchTransactionContent,
  patchTaskContent,
}) => {
  // get hook of form from ant form
  const [form] = Form.useForm();
  const isEdit = !!content;
  const [editorContent, setEditorContent] = useState(
    content ? JSON.parse(content.text) : { delta: '', '###html###': '' }
  );
  const quillRef = useRef<ReactQuill>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (error.length < 1) return;
    message.error(error);
    return () => {
      setError('');
    };
  }, [error]);

  const apiPostNewsImage = (formData: FormData) => {
    const uploadConfig = {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    };
    return axios.post('/api/uploadFile', formData, uploadConfig);
  };
  const imageUploader = () => {
    if (!quillRef) return;
    const editor = quillRef.current!.getEditor();
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();
    console.log('start upload');
    input.onchange = async () => {
      const file = input.files![0];
      const formData = new FormData();
      if (file.size > 20 * 1024 * 1024) {
        setError('The file can not be larger than 20MB');
        return;
      }

      if (!file.type.match('image.*')) {
        setError('The file can only be image');
        return;
      }

      formData.append('file', file);
      // Save current cursor state
      const range = editor.getSelection(true);
      editor.insertEmbed(range.index, 'image', `${placeholder}`);
      try {
        const res = await apiPostNewsImage(formData); // API post, returns image location as string e.g. 'http://www.example.com/images/foo.png'
        editor.deleteText(range.index, 1);
        const link = res.data;
        editor.insertEmbed(range.index, 'image', link);
      } catch (e) {
        // message.error(e.response);
        console.log(e.response.data.message);
        setError(e.response.data.message);
      }
    };
  };
  modules.toolbar.handlers = { image: imageUploader };

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

  const handleChange = (
    content: string,
    delta: any,
    source: any,
    editor: ReactQuill.UnprivilegedEditor
  ) => {
    setEditorContent({
      delta: editor.getContents(),
      '###html###': content,
    });
  };
  console.log(isOpen);
  return (
    <div className="content-editor">
      {isOpen && (
        <ReactQuill
          bounds={'.content-editor'}
          defaultValue={editorContent['delta']}
          value={editorContent['delta']}
          ref={quillRef}
          theme="snow"
          onChange={handleChange}
          modules={modules}
          formats={formats}
        />
      )}
      <Button type="primary" onClick={handleFormSubmit}>
        {isEdit ? 'Update' : 'Create'}
      </Button>
    </div>
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
