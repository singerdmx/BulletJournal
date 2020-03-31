// page diplay contents of notes
import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { getNote } from '../../features/notes/actions';
import { IState } from '../../store';
import { Note } from '../../features/notes/interface';
import { Tooltip, Tag, Avatar, Divider, Drawer, Button } from 'antd';
import { stringToRGB, Label } from '../../features/label/interface';
import { addSelectedLabel } from '../../features/label/actions';
import { icons } from '../../assets/icons/index';
import { updateNoteContents } from '../../features/notes/actions';

import {
  TagOutlined,
  ShareAltOutlined,
  DeleteOutlined,
  RightCircleOutlined,
  PlusCircleTwoTone
} from '@ant-design/icons';

import './note-page.styles.less';
import 'braft-editor/dist/index.css';
import NoteEditor from '../../components/note-editor/note-editor.component';

type NoteProps = {
  note: Note;
};

interface NotePageHandler {
  getNote: (noteId: number) => void;
  addSelectedLabel: (label: Label) => void;
  updateNoteContents: (noteId: number) => void;
}

// get icons by string name
const getIcon = (icon: string) => {
  let res = icons.filter(item => item.name === icon);
  return res.length > 0 ? res[0].icon : <TagOutlined />;
};

const NotePage: React.FC<NotePageHandler & NoteProps> = props => {
  const { note } = props;
  // get id of note from oruter
  const { noteId } = useParams();
  // state control drawer displaying
  const [showEditor, setEditorShow] = useState(false);
  // eidt or update
  const [createOrEdit, setCOE] = useState('create');
  // hook history in router
  const history = useHistory();
  // jump to label searching page by label click
  const toLabelSearching = (label: Label) => {
    console.log(label);
    props.addSelectedLabel(label);
    history.push('/labels/search');
  };
  // listening on the empty state working as componentDidmount
  React.useEffect(() => {
    noteId && props.getNote(parseInt(noteId));
    noteId && props.updateNoteContents(parseInt(noteId));
  }, []);

  const createHandler = () => {
    createOrEdit === 'update' && setCOE('create');
    setEditorShow(true);
  };

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
          <Tooltip title="Add Label">
            <TagOutlined />
          </Tooltip>
          <Tooltip title="Move Note">
            <RightCircleOutlined />
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
      <div className="content">
        <Button onClick={createHandler}>
          <PlusCircleTwoTone />
          New Note
        </Button>
      </div>
      <div className="note-drawer">
        <Drawer
          onClose={() => setEditorShow(false)}
          visible={showEditor}
          placement="bottom"
          height="600"
          destroyOnClose
          closable={false}
        >
          <NoteEditor createOrEdit={createOrEdit} noteId={note.id} />
        </Drawer>
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  note: state.note.note
});

export default connect(mapStateToProps, {
  getNote,
  addSelectedLabel,
  updateNoteContents
})(NotePage);
