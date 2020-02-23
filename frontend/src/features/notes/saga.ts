import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as notesActions,
  NoteApiErrorAction,
  UpdateNotes,
  CreateNote
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchNotes, createNotes
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
    )
  ]);
}