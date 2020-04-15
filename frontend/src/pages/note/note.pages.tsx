// page display contents of notes
// react imports
import React, { useState } from 'react';
import { useHistory, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
// features
//actions
import { deleteNote, getNote } from '../../features/notes/actions';

import { IState } from '../../store';
// components
import NoteEditorDrawer from '../../components/content-editor/editor-drawer.component';
// antd imports
import { Button, Popconfirm, Tooltip } from 'antd';
import {
  DeleteTwoTone,
  PlusCircleTwoTone,
  TagOutlined,
  UpSquareOutlined,
} from '@ant-design/icons';
// modals import
import EditNote from '../../components/modals/edit-note.component';
import MoveProjectItem from '../../components/modals/move-project-item.component';
import ShareProjectItem from '../../components/modals/share-project-item.component';

import './note-page.styles.less';
import 'braft-editor/dist/index.css';
import { ProjectType } from '../../features/project/constants';
import NoteDetailPage, { NoteProps } from './note-detail.pages';

interface NotePageHandler {
  getNote: (noteId: number) => void;
  deleteNote: (noteId: number) => void;
}

// get icons by string name

const NotePage: React.FC<NotePageHandler & NoteProps> = (props) => {
  // hook history in router
  const history = useHistory();
  const { note, deleteNote } = props;
  // get id of note from router
  const { noteId } = useParams();
  // state control drawer displaying
  const [showEditor, setEditorShow] = useState(false);
  const [labelEditable, setLabelEditable] = useState(false);

  // listening on the empty state working as componentDidmount
  React.useEffect(() => {
    noteId && props.getNote(parseInt(noteId));
  }, [noteId]);
  // show drawer
  const createHandler = () => {
    setEditorShow(true);
  };

  const handleClose = () => {
    setEditorShow(false);
  };

  const labelEditableHandler = () => {
    setLabelEditable((labelEditable) => !labelEditable);
  };

  const createContentElem = (
    <Button onClick={createHandler}>
      <PlusCircleTwoTone />
      New
    </Button>
  );

  const noteEditorElem = (
    <div className='note-drawer'>
      <NoteEditorDrawer
        noteId={note.id}
        visible={showEditor}
        onClose={handleClose}
      />
    </div>
  );

  const noteOperation = () => {
    return (
      <div className='note-operation'>
        <Tooltip title='Manage Labels'>
          <div>
            <TagOutlined onClick={labelEditableHandler} />
          </div>
        </Tooltip>
        <EditNote note={note} mode='icon' />
        <MoveProjectItem
          type={ProjectType.NOTE}
          projectItemId={note.id}
          mode='icon'
        />
        <ShareProjectItem
          type={ProjectType.NOTE}
          projectItemId={note.id}
          mode='icon'
        />
        <Tooltip title='Delete'>
          <Popconfirm
            title='Deleting Note also deletes its child notes. Are you sure?'
            okText='Yes'
            cancelText='No'
            onConfirm={() => {
              deleteNote(note.id);
              history.goBack();
            }}
            className='group-setting'
            placement='bottom'
          >
            <div>
              <DeleteTwoTone twoToneColor='#f5222d' />
            </div>
          </Popconfirm>
        </Tooltip>
        <Tooltip title='Go to Parent BuJo'>
          <div>
            <UpSquareOutlined
              onClick={(e) => history.push(`/projects/${note.projectId}`)}
            />
          </div>
        </Tooltip>
      </div>
    );
  };

  return (
    <NoteDetailPage
      note={note}
      labelEditable={labelEditable}
      noteOperation={noteOperation}
      createContentElem={createContentElem}
      noteEditorElem={noteEditorElem}
    />
  );
};

const mapStateToProps = (state: IState) => ({
  note: state.note.note,
});

export default connect(mapStateToProps, {
  deleteNote,
  getNote,
})(NotePage);
