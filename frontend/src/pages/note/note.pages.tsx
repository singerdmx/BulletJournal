import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getNote } from '../../features/notes/actions';
import { IState } from '../../store';
import { Note } from '../../features/notes/interface';
import { Tooltip, Tag, Avatar, Typography, Divider, Form, Button } from 'antd';
import { stringToRGB, Label } from '../../features/label/interface';
import { addSelectedLabel } from '../../features/label/actions';
import { icons } from '../../assets/icons/index';
import BraftEditor from 'braft-editor';
import { BuiltInControlType } from 'braft-editor/index';

import {
  TagOutlined,
  ShareAltOutlined,
  DeleteOutlined
} from '@ant-design/icons';

import './note-page.styles.less';
import 'braft-editor/dist/index.css';

type NoteProps = {
  note: Note;
};

interface NotePageHandler {
  getNote: (noteId: number) => void;
  addSelectedLabel: (label: Label) => void;
}

const NotePage: React.FC<NotePageHandler & NoteProps> = props => {
  const { note } = props;
  const { noteId } = useParams();
  const [showEditor] = useState(true); //setting true for debugging
  const [form] = Form.useForm();
  const history = useHistory();
  const noteControls = [
    'bold',
    'italic',
    'underline',
    'text-color',
    'separator',
    'link',
    'separator',
    'media'
  ] as BuiltInControlType[];

  const toLabelSearching = (label: Label) => {
    console.log(label);
    props.addSelectedLabel(label);
    history.push('/labels/search');
  };

  const getIcon = (icon: string) => {
    let res = icons.filter(item => item.name === icon);
    return res.length > 0 ? res[0].icon : <TagOutlined />;
  };

  React.useEffect(() => {
    noteId && props.getNote(parseInt(noteId));
  }, []);
  return (
    <div className="note-page">
      <Tooltip placement="top" title={note.owner} className="note-avatar">
        <span>
          <Avatar size="large" src={note.ownerAvatar} />
        </span>
      </Tooltip>
      <div className="note-title">
        <div className="label-and-name">
          {note.name}
          <div className="note-labels">
            {note.labels &&
              note.labels.map(label => {
                return (
                  <Tooltip
                    placement="top"
                    title="Click to Check or Edit"
                    key={label.id}
                  >
                    <Tag
                      className="labels"
                      color={stringToRGB(label.value)}
                      style={{ cursor: 'pointer' }}
                    >
                      <span onClick={() => toLabelSearching(label)}>
                        {getIcon(label.icon)} &nbsp;
                        {label.value}
                      </span>
                    </Tag>
                  </Tooltip>
                );
              })}
          </div>
        </div>

        <div className="note-operation">
          <Tooltip title="Add Tag">
            <TagOutlined />
          </Tooltip>
          <Tooltip title="Share Note">
            <ShareAltOutlined />
          </Tooltip>
          <Tooltip title="Delete">
            <DeleteOutlined style={{ color: 'red' }} />
          </Tooltip>
        </div>
      </div>
      <Divider />
      <div className="content-or-editor">
        {!showEditor ? (
          <div></div>
        ) : (
          <div className="editor-wrapper">
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
          </div>
        )}
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  note: state.note.note
});

export default connect(mapStateToProps, { getNote, addSelectedLabel })(
  NotePage
);
