// a editor component for taking and update note
import React from 'react';
import { Form, Button } from 'antd';
import { connect } from 'react-redux';
import BraftEditor from 'braft-editor';
import { Note } from '../../features/notes/interface';
import {
  updateNoteContents,
  createContent
} from '../../features/notes/actions';

type NoteEditorProps = {
  note: Note;
};

interface NoteEditorHandler {
  updateNoteContents: (noteId: number) => void;
  createContent: (noteId: number, text: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps & NoteEditorHandler> = ({
  note,
  updateNoteContents,
  createContent
}) => {
  // get hook of form from ant form
  const [form] = Form.useForm();

  const handleFormSubmit = () => {
    // form.validateFields().then(values => {
    //   if (note.content) {
    //     updateNoteContents()
    //   } else {
    //     createContent(values.noteContent)
    //   }
    // })
  };
  return (
    <Form form={form} onFinish={handleFormSubmit}>
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

export default connect(null, { createContent, updateNoteContents })(NoteEditor);
