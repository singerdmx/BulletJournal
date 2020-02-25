import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Note } from './interface';
import { updateNotes, createNote, putNote, deleteNote } from './actions';

type NotesProps = {
  name: string;
  notes: Note[];
  projectId: number;
  updateNotes: (projectId: number) => void;
  createNote: (projectId: number, name: string) => void;
  putNote: (projectId: number, notes: Note[]) => void;
  deleteNote: (noteId: number) => void;
};

class Notes extends React.Component<NotesProps> {
  componentDidMount() {
    this.props.updateNotes(this.props.projectId);
    this.props.createNote(this.props.projectId, this.props.name);
  }
  
  render() {
    const { notes } = this.props;
    const notesNew: Note = {
      id: 1,
      name: 'test',
      projectId: 1,
      subNotes: [] as Note[]
    }
    const notesList: Note[] = [] as Note[];
    notesList.push(notesNew);
    return (
      <div>
        {notes.map((item, index) => {
            return <div key={index}>{item.name}</div>
        })}
        <div onClick={()=>putNote(1, notesList)}>gogogo</div>
        <div>{()=>deleteNote(1)}</div>
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  notes: state.note.notes
});

export default connect(mapStateToProps, { updateNotes, createNote, putNote, deleteNote })(Notes);