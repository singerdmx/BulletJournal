import {all, call, put, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {
  actions as notesActions,
  CreateNote,
  DeleteNote,
  GetNote,
  MoveNote,
  NoteApiErrorAction,
  PatchNote,
  PutNote,
  SetNoteLabels,
  UpdateNotes
} from './reducer';
import {PayloadAction} from 'redux-starter-kit';
import {
  createNote,
  deleteNoteById,
  fetchNotes,
  getNoteById,
  moveToTargetProject,
  putNotes,
  setNoteLabels,
  updateNote
} from '../../apis/noteApis';
import {updateNotes} from './actions';

function* noteApiErrorReceived(action: PayloadAction<NoteApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* notesUpdate(action: PayloadAction<UpdateNotes>) {
  try {
    const data = yield call(fetchNotes, action.payload.projectId);
    const notes = yield data.json();
    yield put(
        notesActions.notesReceived({
          notes: notes
        })
    );
  } catch (error) {
    yield call(message.error, `Note Error Received: ${error}`);
  }
}

function* noteCreate(action: PayloadAction<CreateNote>) {
  try {
    const {projectId, name} = action.payload;
    yield call(createNote, projectId, name);
    yield put(updateNotes(projectId));
  } catch (error) {
    yield call(message.error, `Note Error Received: ${error}`);
  }
}

function* notePut(action: PayloadAction<PutNote>) {
  try {
    yield call(putNotes, action.payload.projectId, action.payload.notes);
    yield put(updateNotes(action.payload.projectId));
  } catch (error) {
    yield call(message.error, `Put Note Error Received: ${error}`);
  }
}

function* getNote(action: PayloadAction<GetNote>) {
  try {
    const data = yield call(getNoteById, action.payload.noteId);
    yield put(notesActions.noteReceived({note: data}));
  } catch (error) {
    yield call(message.error, `Get Note Error Received: ${error}`);
  }
}

function* patchNote(action: PayloadAction<PatchNote>) {
  try {
    const data = yield call(updateNote, action.payload.noteId, action.payload.name);
    yield put(
      notesActions.notesReceived({
        notes: data
      })
  );
  } catch (error) {
    yield call(message.error, `Patch Note Error Received: ${error}`);
  }
}

function* noteSetLabels(action: PayloadAction<SetNoteLabels>) {
  try {
    const {noteId, labels} = action.payload;
    const data = yield call(setNoteLabels, noteId, labels);
    yield put(updateNotes(data.projectId));
  } catch (error) {
    yield call(message.error, `noteSetLabels Error Received: ${error}`);
  }
}

function* noteDelete(action: PayloadAction<DeleteNote>) {
  try {
    const {noteId} = action.payload;
    const data = yield call(deleteNoteById, noteId);
    const notes = yield data.json();
    yield put(
        notesActions.notesReceived({
          notes: notes
        })
    );
  } catch (error) {
    yield call(message.error, `Delete Note Error Received: ${error}`);
  }
}

function* noteMove(action: PayloadAction<MoveNote>) {
  try {
    const {noteId, targetProject} = action.payload;
    yield call(moveToTargetProject, noteId, targetProject);
    yield call(message.success, 'Note moved successfully');
  } catch (error) {
    yield call(message.error, `noteMove Error Received: ${error}`);
  }
}

export default function* noteSagas() {
  yield all([
    yield takeLatest(
        notesActions.noteApiErrorReceived.type,
        noteApiErrorReceived
    ),
    yield takeLatest(
        notesActions.NotesUpdate.type,
        notesUpdate
    ),
    yield takeLatest(
        notesActions.NotesCreate.type,
        noteCreate
    ),
    yield takeLatest(
        notesActions.NotePut.type,
        notePut
    ),
    yield takeLatest(
        notesActions.NoteGet.type,
        getNote
    ),
    yield takeLatest(
        notesActions.NotePatch.type,
        patchNote
    ),
    yield takeLatest(
        notesActions.NoteSetLabels.type,
        noteSetLabels
    ),
    yield takeLatest(
        notesActions.NoteDelete.type,
        noteDelete,
    ),
    yield takeLatest(
        notesActions.NoteMove.type,
        noteMove,
    )
  ]);
}