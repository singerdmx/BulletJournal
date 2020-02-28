import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as notesActions,
  NoteApiErrorAction,
  UpdateNotes,
  CreateNote,
  PutNote,
  GetNote,
  PatchNote
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchNotes, createNote, putNotes, getNoteById, updateNote
} from '../../apis/noteApis';
import { updateNotes } from './actions';

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
      const data = yield call(createNote, action.payload.projectId, action.payload.name);
      const note = yield data.json();
      yield put(updateNotes(action.payload.projectId));
    } catch (error) {
      yield call(message.error, `Note Error Received: ${error}`);
    }
  }

function* notePut(action: PayloadAction<PutNote>) {
    try{
      const data = yield call(putNotes, action.payload.projectId, action.payload.notes);
      yield put(updateNotes(action.payload.projectId));
    } catch (error) {
      yield call(message.error, `Put Note Error Received: ${error}`);
    }
}

function* getNote(action: PayloadAction<GetNote>) {
  try {
    const data = yield call(getNoteById, action.payload.noteId);
  } catch (error) {
    yield call(message.error, `Get Note Error Received: ${error}`);
  }
}

function* patchNote(action: PayloadAction<PatchNote>) {
  try {
    yield call(updateNote, action.payload.noteId, action.payload.name);
  } catch (error) {
    yield call(message.error, `Patch Note Error Received: ${error}`);
  }
}

export default function* noticeSagas() {
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
      notesActions.PatchNote.type,
      patchNote
    )
  ]);
}