// page diplay contents of notes
// react imports
import React, { useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
// features
import { getNote } from '../../features/notes/actions';
import { Note } from '../../features/notes/interface';
import { stringToRGB, Label } from '../../features/label/interface';
import { addSelectedLabel } from '../../features/label/actions';
import { IState } from '../../store';
// compoennts
import NoteEditorDrawer from '../../components/note-editor/editor-drawer.component';
import NoteContentList from '../../components/note-content/content-list.component';
// antd imports
import { Tooltip, Tag, Avatar, Divider, Button, Popconfirm } from 'antd';
import {
  TagOutlined,
  DeleteTwoTone,
  PlusCircleTwoTone
} from '@ant-design/icons';
// modals import
import EditNote from '../../components/modals/edit-note.component';
import MoveProjectItem from '../../components/modals/move-project-item.component';
import ShareProjectItem from '../../components/modals/share-project-item.component';
//actions
import { deleteNote } from '../../features/notes/actions';

import { icons } from '../../assets/icons/index';
import './note-page.styles.less';
import 'braft-editor/dist/index.css';

type NoteProps = {
  note: Note;
  deleteNote: (noteId: number) => void;
};

interface NotePageHandler {
  getNote: (noteId: number) => void;
  addSelectedLabel: (label: Label) => void;
}

// get icons by string name
const getIcon = (icon: string) => {
  let res = icons.filter(item => item.name === icon);
  return res.length > 0 ? res[0].icon : <TagOutlined />;
};

const NotePage: React.FC<NotePageHandler & NoteProps> = props => {
  const { note, deleteNote } = props;
  // get id of note from oruter
  const { noteId } = useParams();
  // state control drawer displaying
  const [showEditor, setEditorShow] = useState(false);
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
  }, [noteId]);
  // show drawer
  const createHandler = () => {
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
              note.labels.map((label, index) => {
                return (
                  <Tag
                    key={index}
                    className="labels"
                    color={stringToRGB(label.value)}
                    style={{ cursor: 'pointer', display: 'inline-block' }}
                  >
                    <span onClick={() => toLabelSearching(label)}>
                      {getIcon(label.icon)} &nbsp;
                      {label.value}
                    </span>
                  </Tag>
                );
              })}
          </div>
        </div>

        <div className="note-operation">
          <Tooltip title="Add Label">
            <TagOutlined />
          </Tooltip>
          <Tooltip title="Edit Label">
            <EditNote note={note} mode="icon" />
          </Tooltip>
          <Tooltip title="Move Note">
            <MoveProjectItem type="NOTE" projectItemId={note.id} mode="icon" />
          </Tooltip>
          <Tooltip title="Share Note">
            <ShareProjectItem type="NOTE" projectItemId={note.id} mode="icon" />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Deleting Note also deletes its child notes. Are you sure?"
              okText="Yes"
              cancelText="No"
              onConfirm={() => {
                deleteNote(note.id);
                history.goBack();
              }}
              className="group-setting"
              placement="bottom"
            >
              <DeleteTwoTone twoToneColor="#f5222d" />
            </Popconfirm>
          </Tooltip>
        </div>
      </div>
      <Divider />
      <div className="content">
        <div className="content-list">
          <NoteContentList noteId={note.id} />
        </div>
        <Button onClick={createHandler}>
          <PlusCircleTwoTone />
          New
        </Button>
      </div>
      <div className="note-drawer">
        <NoteEditorDrawer
          noteId={note.id}
          visible={showEditor}
          setVisible={setEditorShow}
        />
      </div>
    </div>
  );
};

const mapStateToProps = (state: IState) => ({
  note: state.note.note
});

export default connect(mapStateToProps, {
  deleteNote,
  getNote,
  addSelectedLabel
})(NotePage);
