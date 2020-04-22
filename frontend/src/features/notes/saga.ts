import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import { message } from 'antd';
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
  ShareNote,
  UpdateNoteContents,
  UpdateNotes,
  CreateContent,
  DeleteContent,
  PatchContent,
  GetSharables,
  RevokeSharable,
  UpdateNoteContentRevision
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  createNote,
  deleteNoteById,
  fetchNotes,
  getNoteById,
  moveToTargetProject,
  putNotes,
  setNoteLabels,
  shareNoteWithOther,
  updateNote,
  getContents,
  addContent,
  deleteContent,
  updateContent,
  getSharables,
  revokeSharable,
  getContentRevision
} from '../../apis/noteApis';
import { IState } from '../../store';
import { updateNoteContents, updateNotes } from './actions';
import {Content, Revision} from "../myBuJo/interface";

function* noteApiErrorReceived(action: PayloadAction<NoteApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* notesUpdate(action: PayloadAction<UpdateNotes>) {
  try {
    const data = yield call(fetchNotes, action.payload.projectId);
    const notes = yield data.json();
    yield put(
      notesActions.notesReceived({
        notes: notes,
      })
    );
  } catch (error) {
    yield call(message.error, `Note Error Received: ${error}`);
  }
}

function* noteContentsUpdate(action: PayloadAction<UpdateNoteContents>) {
  try {
    const contents = yield call(getContents, action.payload.noteId);
    yield put(
      notesActions.noteContentsReceived({
        contents: contents,
      })
    );
  } catch (error) {
    yield call(message.error, `noteContentsUpdate Error Received: ${error}`);
  }
}

function* noteContentRevisionUpdate(action: PayloadAction<UpdateNoteContentRevision>) {
  try {
    const { noteId, contentId, revisionId } = action.payload;
    const state: IState = yield select();

    const targetContent : Content = state.note.contents.find(c => c.id === contentId)!;
    const revision: Revision = targetContent.revisions.find(r => r.id === revisionId)!;

    if (!revision.content) {
      const data = yield call(getContentRevision, noteId, contentId, revisionId);

      const noteContents : Content[] = [];
      state.note.contents.forEach((noteContent) => {
        if (noteContent.id === contentId) {
          const newRevisions : Revision[] = [];
          noteContent.revisions.forEach((revision) => {
            if (revision.id === revisionId) {
              revision = { ...revision, content: data.content };
            }
            newRevisions.push(revision);
          });
          noteContent = { ...noteContent, revisions: newRevisions };
        }
        noteContents.push(noteContent);
      });
      yield put(
          notesActions.noteContentsReceived({
            contents: noteContents,
          })
      );
    }
  } catch (error) {
    yield call(message.error, `noteContentRevisionUpdate Error Received: ${error}`);
  }
}

function* noteCreate(action: PayloadAction<CreateNote>) {
  try {
    const { projectId, name } = action.payload;
    yield call(createNote, projectId, name);
    yield put(updateNotes(projectId));
  } catch (error) {
    yield call(message.error, `Note Error Received: ${error}`);
  }
}

function* createNoteContent(action: PayloadAction<CreateContent>) {
  try {
    const { noteId, text } = action.payload;
    yield call(addContent, noteId, text);
    yield put(updateNoteContents(noteId));
  } catch (error) {
    yield call(message.error, `createNoteContent Error Received: ${error}`);
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
    yield put(notesActions.noteReceived({ note: data }));
  } catch (error) {
    yield call(message.error, `Get Note Error Received: ${error}`);
  }
}

function* patchNote(action: PayloadAction<PatchNote>) {
  try {
    const { noteId, name } = action.payload;
    const data = yield call(updateNote, noteId, name);
    yield put(
      notesActions.notesReceived({
        notes: data,
      })
    );

    const note = yield call(getNoteById, noteId);
    yield put(
      notesActions.noteReceived({
        note: note,
      })
    );
  } catch (error) {
    yield call(message.error, `Patch Note Error Received: ${error}`);
  }
}

function* patchContent(action: PayloadAction<PatchContent>) {
  try {
    const { noteId, contentId, text } = action.payload;
    const contents = yield call(updateContent, noteId, contentId, text);
    yield put(
      notesActions.noteContentsReceived({
        contents: contents,
      })
    );
  } catch (error) {
    yield call(message.error, `Patch Content Error Received: ${error}`);
  }
}

function* noteSetLabels(action: PayloadAction<SetNoteLabels>) {
  try {
    const { noteId, labels } = action.payload;
    const data = yield call(setNoteLabels, noteId, labels);
    yield put(notesActions.noteReceived({note: data}));
    yield put(updateNotes(data.projectId));
  } catch (error) {
    yield call(message.error, `noteSetLabels Error Received: ${error}`);
  }
}

function* noteDelete(action: PayloadAction<DeleteNote>) {
  try {
    const { noteId } = action.payload;
    const data = yield call(deleteNoteById, noteId);
    const notes = yield data.json();
    yield put(
      notesActions.notesReceived({
        notes: notes,
      })
    );
  } catch (error) {
    yield call(message.error, `Delete Note Error Received: ${error}`);
  }
}

function* deleteNoteContent(action: PayloadAction<DeleteContent>) {
  try {
    const { noteId, contentId } = action.payload;
    const data = yield call(deleteContent, noteId, contentId);
    const contents = yield data.json();
    yield put(
      notesActions.noteContentsReceived({
        contents: contents,
      })
    );
  } catch (error) {
    yield call(
      message.error,
      `noteContentDelete Note Error Received: ${error}`
    );
  }
}

function* noteMove(action: PayloadAction<MoveNote>) {
  try {
    const { noteId, targetProject, history } = action.payload;
    yield call(moveToTargetProject, noteId, targetProject);
    yield call(message.success, 'Note moved successfully');
    history.push(`/projects/${targetProject}`);
  } catch (error) {
    yield call(message.error, `noteMove Error Received: ${error}`);
  }
}

function* shareNote(action: PayloadAction<ShareNote>) {
  try {
    const { noteId, targetUser, targetGroup, generateLink, ttl } = action.payload;
    const data = yield call(
      shareNoteWithOther,
      noteId,
      generateLink,
      targetUser,
      targetGroup,
      ttl
    );
    if (generateLink) {
      yield put(notesActions.sharedLinkReceived({link: data.link}));
    }
    yield call(message.success, 'Note shared successfully');
  } catch (error) {
    yield call(message.error, `noteShare Error Received: ${error}`);
  }
}

function* getNoteSharables(action: PayloadAction<GetSharables>) {
  try {
    const { noteId } = action.payload;
    const data = yield call(
        getSharables,
        noteId,
    );

    yield put(notesActions.noteSharablesReceived({
      users: data.users,
      links: data.links
    }));
  } catch (error) {
    yield call(message.error, `getNoteSharables Error Received: ${error}`);
  }
}

function* revokeNoteSharable(action: PayloadAction<RevokeSharable>) {
  try {
    const { noteId, user, link } = action.payload;
    yield call(
        revokeSharable,
        noteId,
        user,
        link
    );

    const state: IState = yield select();

    let sharedUsers = state.note.sharedUsers;
    let sharedLinks = state.note.sharedLinks;

    if (user) {
      sharedUsers = sharedUsers.filter(u => u.name !== user);
    }

    if (link) {
      sharedLinks = sharedLinks.filter(l => l.link !== link);
    }

    yield put(notesActions.noteSharablesReceived({
      users: sharedUsers,
      links: sharedLinks
    }));
  } catch (error) {
    yield call(message.error, `revokeNoteSharable Error Received: ${error}`);
  }
}

export default function* noteSagas() {
  yield all([
    yield takeLatest(
      notesActions.noteApiErrorReceived.type,
      noteApiErrorReceived
    ),
    yield takeLatest(notesActions.NotesUpdate.type, notesUpdate),
    yield takeLatest(notesActions.NoteContentsUpdate.type, noteContentsUpdate),
    yield takeLatest(notesActions.NoteContentRevisionUpdate.type, noteContentRevisionUpdate),
    yield takeLatest(notesActions.NotesCreate.type, noteCreate),
    yield takeLatest(notesActions.NoteContentCreate.type, createNoteContent),
    yield takeLatest(notesActions.NotePut.type, notePut),
    yield takeLatest(notesActions.NoteGet.type, getNote),
    yield takeLatest(notesActions.NotePatch.type, patchNote),
    yield takeLatest(notesActions.NoteContentPatch.type, patchContent),
    yield takeLatest(notesActions.NoteSetLabels.type, noteSetLabels),
    yield takeLatest(notesActions.NoteDelete.type, noteDelete),
    yield takeLatest(notesActions.NoteContentDelete.type, deleteNoteContent),
    yield takeLatest(notesActions.NoteMove.type, noteMove),
    yield takeLatest(notesActions.NoteShare.type, shareNote),
    yield takeLatest(notesActions.NoteSharablesGet.type, getNoteSharables),
    yield takeLatest(notesActions.NoteRevokeSharable.type, revokeNoteSharable),
  ]);
}
