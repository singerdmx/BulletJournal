import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as notesActions,
  NoteApiErrorAction,
  UpdateNotes,
  CreateNote,
  PutNote,
  GetNote
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchNotes, createNotes, putNotes, getNoteById
} from '../../apis/noteApis';
import { updateNotes } from './actions';
import { Note } from './interface';
import { IState } from '../../store';

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
      const data = yield call(createNotes, action.payload.projectId, action.payload.name);
      const notes = yield data.json();
      yield put(updateNotes(action.payload.projectId));
    } catch (error) {
      yield call(message.error, `Note Error Received: ${error}`);
    }
  }

function* notePut(action: PayloadAction<PutNote>) {
    try{
      const data = yield call(putNotes, action.payload.projectId, action.payload.notes)
      yield put(updateNotes(action.payload.projectId));
    } catch (error) {
      yield call(message.error, `Put Note Error Received: ${error}`);
    }
}

function* getNote(action: PayloadAction<GetNote>) {
  try{
    const data = yield call(getNoteById, action.payload.noteId, )
  }catch (error) {
    yield call(message.error, `Get Note Error Received: ${error}`);
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
      )
  ]);
}