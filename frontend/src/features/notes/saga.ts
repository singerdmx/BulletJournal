import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {
  actions as notesActions,
  CreateContent,
  CreateNote,
  DeleteContent,
  DeleteNote,
  DeleteNotes,
  GetNote,
  GetNotesByOrder,
  GetNotesByOwner,
  GetSharables,
  MoveNote,
  NoteApiErrorAction,
  PatchContent,
  PatchNote,
  PatchRevisionContents,
  PutNote,
  RemoveShared,
  RevokeSharable,
  SetNoteLabels,
  ShareNote,
  UpdateNoteContentRevision,
  UpdateNoteContents,
  UpdateNotes,
} from './reducer';
import {PayloadAction} from 'redux-starter-kit';
import {
  addContent,
  createNote,
  deleteContent,
  deleteNoteById,
  deleteNotes as deleteNotesApi,
  fetchNotes,
  getContentRevision,
  getContents,
  getNoteById,
  getSharables,
  moveToTargetProject,
  patchRevisionContents,
  putNotes,
  removeShared,
  revokeSharable,
  setNoteLabels,
  shareNoteWithOther,
  updateContent,
  updateNote
} from '../../apis/noteApis';
import {IState} from '../../store';
import {updateNoteContents, updateNotes} from './actions';
import {Content, ProjectItems, Revision} from '../myBuJo/interface';
import {projectLabelsUpdate, updateItemsByLabels} from '../label/actions';
import {actions as SystemActions} from '../system/reducer';
import {Note} from './interface';
import {ProjectItemUIType} from "../project/constants";
import {ContentType} from "../myBuJo/constants";
import {recentItemsReceived} from "../recent/actions";
import {setDisplayMore, updateTargetContent} from "../content/actions";
import {reloadReceived} from "../myself/actions";

function* noteApiErrorReceived(action: PayloadAction<NoteApiErrorAction>) {
  yield call(message.error, `Notice Error Received: ${action.payload.error}`);
}

function* notesUpdate(action: PayloadAction<UpdateNotes>) {
  try {
    const { projectId } = action.payload;
    const data = yield call(fetchNotes, projectId);
    const notes = yield data.json();
    yield put(
      notesActions.notesReceived({
        notes: notes,
      })
    );

    const etag = data.headers.get('Etag')!;
    //get etag from header
    const state = yield select();
    const systemState = state.system;
    yield put(
      SystemActions.systemUpdateReceived({
        ...systemState,
        notesEtag: etag,
      })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Note Error Received: ${error}`);
    }
  }
}

function* noteContentsUpdate(action: PayloadAction<UpdateNoteContents>) {
  try {
    const { noteId, updateDisplayMore } = action.payload;
    const contents : Content[] = yield call(getContents, noteId);
    yield put(
      notesActions.noteContentsReceived({
        contents: contents,
      })
    );
    let targetContent = undefined;
    if (contents && contents.length > 0) {
      const state: IState = yield select();
      targetContent = contents[0];
      if (state.content.content && state.content.content.id) {
        const found = contents.find((c) => c.id === state.content.content!.id);
        if (found) {
          targetContent = found;
        }
      }
    }
    yield put(updateTargetContent(targetContent));

    if (updateDisplayMore === true) {
      yield put(setDisplayMore(true));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else if (error.message === '404') {
      console.log(`Note ${action.payload.noteId} not found`);
    } else {
      yield call(message.error, `noteContentsUpdate Error Received: ${error}`);
    }
  }
}

function* noteContentRevisionUpdate(
  action: PayloadAction<UpdateNoteContentRevision>
) {
  try {
    const { noteId, contentId, revisionId } = action.payload;
    const state: IState = yield select();

    const targetContent: Content = state.note.contents.find(
      (c) => c.id === contentId
    )!;
    const revision: Revision = targetContent.revisions.find(
      (r) => r.id === revisionId
    )!;

    if (!revision.content) {
      const data = yield call(
        getContentRevision,
        noteId,
        contentId,
        revisionId
      );

      const noteContents: Content[] = [];
      state.note.contents.forEach((noteContent) => {
        if (noteContent.id === contentId) {
          const newRevisions: Revision[] = [];
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
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(
          message.error,
          `noteContentRevisionUpdate Error Received: ${error}`
      );
    }
  }
}

function* getNotesByOwner(action: PayloadAction<GetNotesByOwner>) {
  try {
    const { projectId, owner } = action.payload;
    const data = yield call(fetchNotes, projectId, owner);
    const notesByOwner = yield data.json();
    yield put(
      notesActions.notesByOwnerReceived({
        notesByOwner: notesByOwner,
      })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getNotesByOwner Error Received: ${error}`);
    }
  }
}

function* getNotesByOrder(action: PayloadAction<GetNotesByOrder>) {
  try {
    const { projectId, timezone, startDate, endDate } = action.payload;
    const data = yield call(
      fetchNotes,
      projectId,
      undefined,
      timezone,
      startDate,
      endDate,
      true
    );
    const notesByOrder = yield data.json();
    yield put(
      notesActions.notesByOrderReceived({
        notesByOrder: notesByOrder,
      })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getNotesByOrder Error Received: ${error}`);
    }
  }
}

function* noteCreate(action: PayloadAction<CreateNote>) {
  try {
    const { projectId, name, labels } = action.payload;
    yield call(createNote, projectId, name, labels);
    yield put(updateNotes(projectId));
    const state: IState = yield select();
    if (state.project.project) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Note Error Received: ${error}`);
    }
  }
}

function* createNoteContent(action: PayloadAction<CreateContent>) {
  try {
    const { noteId, text } = action.payload;
    const content: Content = yield call(addContent, noteId, text);
    yield put(updateNoteContents(noteId));
    yield put(updateTargetContent(content));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `createNoteContent Error Received: ${error}`);
    }
  }
}

function* notePut(action: PayloadAction<PutNote>) {
  try {
    const { projectId, notes } = action.payload;
    const state: IState = yield select();
    const data = yield call(putNotes, projectId, notes, state.system.notesEtag);
    const updatedNotes = yield data.json();
    yield put(notesActions.notesReceived({ notes: updatedNotes }));

    const etag = data.headers.get('Etag')!;
    //get etag from header
    const systemState = state.system;
    yield put(
      SystemActions.systemUpdateReceived({
        ...systemState,
        notesEtag: etag,
      })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Put Note Error Received: ${error}`);
    }
  }
}

function* getNote(action: PayloadAction<GetNote>) {
  try {
    const data = yield call(getNoteById, action.payload.noteId);
    yield put(notesActions.noteReceived({ note: data }));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, 'Note Unavailable');
    }
  }
}

function* patchNote(action: PayloadAction<PatchNote>) {
  try {
    const { noteId, name, labels } = action.payload;
    const data = yield call(updateNote, noteId, name, labels);
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

    const state: IState = yield select();

    const labelItems: ProjectItems[] = [];

    state.label.items.forEach((projectItem: ProjectItems) => {
      projectItem = { ...projectItem };
      if (projectItem.notes) {
        projectItem.notes = projectItem.notes.map((eachNote) => {
          if (eachNote.id === noteId) return note;
          else return eachNote;
        });
      }
      labelItems.push(projectItem);
    });
    yield put(updateItemsByLabels(labelItems));

    if (state.project.project) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Patch Note Error Received: ${error}`);
    }
  }
}

function* patchContent(action: PayloadAction<PatchContent>) {
  try {
    const { noteId, contentId, text, diff } = action.payload;
    const state: IState = yield select();
    const order = state.note.contents.map(c => c.id);

    const contents : Content[] = yield call(updateContent, noteId, contentId, text, state.content.content!.etag, diff);
    contents.sort((a: Content, b: Content) => {
      return order.findIndex((o) => o === a.id) - order.findIndex((o) => o === b.id);
    });
    yield put(
      notesActions.noteContentsReceived({
        contents: contents,
      })
    );
    yield put(updateTargetContent(contents.filter(c => c.id === contentId)[0]));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Patch Content Error Received: ${error}`);
    }
  }
}

function* noteSetLabels(action: PayloadAction<SetNoteLabels>) {
  try {
    const { noteId, labels } = action.payload;
    const data = yield call(setNoteLabels, noteId, labels);
    yield put(notesActions.noteReceived({ note: data }));
    yield put(updateNotes(data.projectId));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `noteSetLabels Error Received: ${error}`);
    }
  }
}

function* noteDelete(action: PayloadAction<DeleteNote>) {
  try {
    const { noteId, type } = action.payload;
    const data = yield call(deleteNoteById, noteId);
    const notes = yield data.json();
    yield put(
      notesActions.notesReceived({
        notes: notes,
      })
    );
    yield put(notesActions.noteReceived({ note: undefined }));
    const state: IState = yield select();
    if (type === ProjectItemUIType.LABEL) {
      const labelItems: ProjectItems[] = [];
      state.label.items.forEach((projectItem: ProjectItems) => {
        projectItem = {...projectItem};
        if (projectItem.notes) {
          projectItem.notes = projectItem.notes.filter(
              (note) => note.id !== noteId
          );
        }
        labelItems.push(projectItem);
      });
      yield put(updateItemsByLabels(labelItems));
    }

    if (type === ProjectItemUIType.OWNER) {
      const notesByOwner = state.note.notesByOwner.filter((n) => n.id !== noteId);
      yield put(
          notesActions.notesByOwnerReceived({
            notesByOwner: notesByOwner,
          })
      );
    }

    if (type === ProjectItemUIType.ORDER) {
      const notesByOrder = state.note.notesByOrder.filter((n) => n.id !== noteId);
      yield put(
          notesActions.notesByOrderReceived({
            notesByOrder: notesByOrder,
          })
      );
    }

    if (type === ProjectItemUIType.RECENT) {
      const recentItems = state.recent.items.filter((t) => t.contentType !== ContentType.NOTE || t.id !== noteId);
      yield put(recentItemsReceived(recentItems));
    }

    yield put(notesActions.noteReceived({note: undefined}));

    if (state.project.project && ![ProjectItemUIType.LABEL, ProjectItemUIType.TODAY, ProjectItemUIType.RECENT].includes(type)) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Delete Note Error Received: ${error}`);
    }
  }
}

function* notesDelete(action: PayloadAction<DeleteNotes>) {
  try {
    const { projectId, notesId, type } = action.payload;
    const data = yield call(deleteNotesApi, projectId, notesId);
    const notes: Note[] = yield data.json();
    yield put(
      notesActions.notesReceived({
        notes: notes,
      })
    );

    yield put(notesActions.noteReceived({ note: undefined }));
    const state: IState = yield select();

    if (type === ProjectItemUIType.OWNER) {
      const notesByOwner = state.note.notesByOwner.filter(
        (n) => !notesId.includes(n.id)
      );
      yield put(
        notesActions.notesByOwnerReceived({
          notesByOwner: notesByOwner,
        })
      );
    }

    if (type === ProjectItemUIType.ORDER) {
      const notesByOrder = state.note.notesByOrder.filter(
        (n) => !notesId.includes(n.id)
      );
      yield put(
        notesActions.notesByOrderReceived({
          notesByOrder: notesByOrder,
        })
      );
    }

    yield put(notesActions.noteReceived({note: undefined}));

    if (state.project.project && ![ProjectItemUIType.LABEL, ProjectItemUIType.TODAY, ProjectItemUIType.RECENT].includes(type)) {
      yield put(projectLabelsUpdate(state.project.project.id, state.project.project.shared));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Delete Notes Error Received: ${error}`);
    }
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
    yield put(updateTargetContent(contents.length > 0 ? contents[0] : undefined));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(
          message.error,
          `noteContentDelete Note Error Received: ${error}`
      );
    }
  }
}

function* noteMove(action: PayloadAction<MoveNote>) {
  try {
    const { noteId, targetProject, history } = action.payload;
    yield call(moveToTargetProject, noteId, targetProject);
    yield call(message.success, 'Note moved successfully');
    history.push(`/projects/${targetProject}`);
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `noteMove Error Received: ${error}`);
    }
  }
}

function* shareNote(action: PayloadAction<ShareNote>) {
  try {
    const {
      noteId,
      targetUser,
      targetGroup,
      generateLink,
      ttl,
    } = action.payload;
    const data = yield call(
      shareNoteWithOther,
      noteId,
      generateLink,
      targetUser,
      targetGroup,
      ttl
    );
    if (generateLink) {
      yield put(notesActions.sharedLinkReceived({ link: data.link }));
    }
    yield call(message.success, 'Note shared successfully');
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `noteShare Error Received: ${error}`);
    }
  }
}

function* getNoteSharables(action: PayloadAction<GetSharables>) {
  try {
    const { noteId } = action.payload;
    const data = yield call(getSharables, noteId);

    yield put(
      notesActions.noteSharablesReceived({
        users: data.users,
        links: data.links,
      })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `getNoteSharables Error Received: ${error}`);
    }
  }
}

function* revokeNoteSharable(action: PayloadAction<RevokeSharable>) {
  try {
    const { noteId, user, link } = action.payload;
    yield call(revokeSharable, noteId, user, link);

    const state: IState = yield select();

    let sharedUsers = state.note.sharedUsers;
    let sharedLinks = state.note.sharedLinks;

    if (user) {
      sharedUsers = sharedUsers.filter((u) => u.name !== user);
    }

    if (link) {
      sharedLinks = sharedLinks.filter((l) => l.link !== link);
    }

    yield put(
      notesActions.noteSharablesReceived({
        users: sharedUsers,
        links: sharedLinks,
      })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `revokeNoteSharable Error Received: ${error}`);
    }
  }
}

function* removeSharedNote(action: PayloadAction<RemoveShared>) {
  try {
    const {noteId} = action.payload;
    yield call(removeShared, noteId);
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `removeSharedNote Error Received: ${error}`);
    }
  }
}

function* patchNoteRevisionContents(action: PayloadAction<PatchRevisionContents>) {
  try {
    const {noteId, contentId, revisionContents, etag} = action.payload;
    const data : Content = yield call(patchRevisionContents, noteId, contentId, revisionContents, etag);
    const state: IState = yield select();
    if (data && state.content.content && data.id === state.content.content.id) {
      yield put(updateTargetContent(data));
    }

    if (data && data.id) {
      const contents : Content[] = [];
      state.task.contents.forEach(c => {
        if (c.id === data.id) {
          contents.push(data);
        } else {
          contents.push(c);
        }
      });
      yield put(
          notesActions.noteContentsReceived({
            contents: contents,
          })
      );
    }
  } catch (error) {
    yield put(reloadReceived(true));
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
    yield takeLatest(
      notesActions.NoteContentRevisionUpdate.type,
      noteContentRevisionUpdate
    ),
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
    yield takeLatest(notesActions.NoteRemoveShared.type, removeSharedNote),
    yield takeLatest(notesActions.getNotesByOwner.type, getNotesByOwner),
    yield takeLatest(notesActions.getNotesByOrder.type, getNotesByOrder),
    yield takeLatest(notesActions.NotesDelete.type, notesDelete),
    yield takeLatest(notesActions.NotePatchRevisionContents.type, patchNoteRevisionContents),
  ]);
}
