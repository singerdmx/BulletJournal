import React from 'react';
import { IState } from '../../store';
import { connect } from 'react-redux';
import { Note } from './interface';
import { updateNotes, createNote } from './actions';

type NotesProps = {
  name: string;
  notes: Note[];
  projectId: number;
  updateNotes: (projectId: number) => void;
  createNote: (projectId: number, name: string) => void;
};

class Notes extends React.Component<NotesProps> {
  componentDidMount() {
    this.props.updateNotes(this.props.projectId);
    this.props.createNote(this.props.projectId, this.props.name)
  }
  
  render() {
    const { notes } = this.props;
    return (
      <div>
        {notes.map((item, index) => {
            return <div key={index}>{item.name}</div>
        })}
      </div>
    );
  }
}

const mapStateToProps = (state: IState) => ({
  notes: state.note.notes
});

export default connect(mapStateToProps, { updateNotes, createNote })(Notes);