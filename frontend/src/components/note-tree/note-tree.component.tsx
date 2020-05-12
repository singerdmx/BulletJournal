import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router';
import { TreeNodeNormal } from 'antd/lib/tree/Tree';
import { Tree } from 'antd';
import TreeItem from '../project-item/note-item.component';
import { putNote, updateNotes } from '../../features/notes/actions';
import { Note } from '../../features/notes/interface';
import { IState } from '../../store';
import './note-tree.component.styles.less';
import { Project } from '../../features/project/interface';
import { User } from '../../features/group/interface';

type NotesProps = {
  notes: Note[];
  readOnly: boolean;
  project: Project | undefined;
  updateNotes: (projectId: number) => void;
  putNote: (projectId: number, notes: Note[]) => void;
  showModal?: (user: User) => void;
};

const getTree = (
  data: Note[],
  readOnly: boolean,
  showModal?: (user: User) => void
): TreeNodeNormal[] => {
  let res = [] as TreeNodeNormal[];
  data.forEach((item: Note) => {
    const node = {} as TreeNodeNormal;
    if (item.subNotes && item.subNotes.length) {
      node.children = getTree(item.subNotes, readOnly, showModal);
    } else {
      node.children = [] as TreeNodeNormal[];
    }
    node.title = (
      <TreeItem
        note={item}
        readOnly={readOnly}
        inProject={true}
        showModal={showModal}
      />
    );
    node.key = item.id.toString();
    res.push(node);
  });
  return res;
};

const onDragEnter = (info: any) => {
  // expandedKeys 需要受控时设置
  // setState({
  //   expendKey: info.expandedKeys,
  // });
};

const findNoteById = (notes: Note[], noteId: number): Note => {
  let res = {} as Note;
  const searchNote = notes.find((item) => item.id === noteId);
  if (searchNote) {
    res = searchNote;
  } else {
    for (let i = 0; i < notes.length; i++) {
      const searchSubNote = findNoteById(notes[i].subNotes, noteId);
      if (searchSubNote.id) {
        res = searchSubNote;
      }
    }
  }
  return res;
};

const dragNoteById = (notes: Note[], noteId: number): Note[] => {
  let res = [] as Note[];
  notes.forEach((item, index) => {
    let note = {} as Note;
    const subNotes = dragNoteById(item.subNotes, noteId);
    note = { ...item, subNotes: subNotes };
    if (note.id !== noteId) res.push(note);
  });
  return res;
};

const DropNoteById = (
  notes: Note[],
  dropId: number,
  dropNote: Note
): Note[] => {
  let res = [] as Note[];
  notes.forEach((item, index) => {
    let note = {} as Note;
    let subNotes = [] as Note[];
    if (item.id === dropId) {
      subNotes = item.subNotes;
      subNotes.push(dropNote);
    } else {
      subNotes = DropNoteById(item.subNotes, dropId, dropNote);
    }
    note = { ...item, subNotes: subNotes };
    res.push(note);
  });
  return res;
};

const onDrop = (notes: Note[], putNote: Function, projectId: number) => (
  info: any
) => {
  const targetNote = findNoteById(notes, parseInt(info.dragNode.key));
  const dropPos = info.node.props.pos.split('-');
  const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);
  const dragNotes = dragNoteById(notes, parseInt(info.dragNode.key));
  const droppingIndex = info.dropPosition + 1;
  let resNotes = [] as Note[];
  if (dropPosition === -1) {
    const dragIndex = notes.findIndex((note) => note.id === targetNote.id);
    if (dragIndex >= droppingIndex) {
      dragNotes.splice(droppingIndex, 0, targetNote);
      resNotes = dragNotes;
    } else {
      dragNotes.splice(droppingIndex - 1, 0, targetNote);
      resNotes = dragNotes;
    }
  } else {
    resNotes = DropNoteById(dragNotes, parseInt(info.node.key), targetNote);
  }
  putNote(projectId, resNotes);
};

const NoteTree: React.FC<RouteComponentProps & NotesProps> = (props) => {
  const { project, notes, putNote, updateNotes, readOnly, showModal } = props;
  useEffect(() => {
    if (project) {
      updateNotes(project.id);
    }
  }, [project]);
  let treeNote = getTree(notes, readOnly, showModal);

  if (!project) {
    return null;
  }
  return (
    <Tree
      className='ant-tree'
      draggable
      blockNode
      onDragEnter={onDragEnter}
      onDrop={onDrop(notes, putNote, project.id)}
      treeData={treeNote}
    />
  );
};

const mapStateToProps = (state: IState) => ({
  project: state.project.project,
  notes: state.note.notes,
});

export default connect(mapStateToProps, {
  updateNotes,
  putNote,
})(withRouter(NoteTree));
