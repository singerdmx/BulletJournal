import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as groupsActions,
  AddUserGroupAction,
  ApiErrorAction,
  DeleteGroupAction,
  GetGroupAction,
  GroupCreateAction,
  GroupsAction,
  GroupUpdateAction,
  PatchGroupAction,
  RemoveUserGroupAction,
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  addGroup,
  addUserGroup,
  deleteGroup,
  fetchGroups,
  getGroup,
  removeUserGroup,
  updateGroup,
} from '../../apis/groupApis';
import { IState } from '../../store';
import { clearUser } from '../user/actions';
import { actions as SystemActions } from '../system/reducer';
import {reloadReceived} from "../myself/actions";

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(message.error, `Group Error Received: ${action.payload.error}`);
}

function* groupsUpdate(action: PayloadAction<GroupsAction>) {
  try {
    //get etag from header
    const state = yield select();
    const systemState = state.system;
    const data = yield call(fetchGroups);
    const etag = data.headers.get('Etag')!;
    if (etag) {
      yield put(
        SystemActions.systemUpdateReceived({
          ...systemState,
          groupsEtag: etag,
        })
      );
    }
    const groups = yield data.json();
    yield put(groupsActions.groupsReceived({ groups: groups }));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `groupsUpdate Error Received: ${error}`);
    }
  }
}

function* groupUpdate(action: PayloadAction<GroupUpdateAction>) {
  const state: IState = yield select();
  if (state.group.group && state.group.group.id) {
    yield put(
      groupsActions.getGroup({ groupId: state.group.group.id, hideError: true })
    );
  }
}

function* createGroup(action: PayloadAction<GroupCreateAction>) {
  const name = action.payload.name;
  try {
    const data = yield call(addGroup, name);
    yield put(groupsActions.groupReceived({ group: data }));
    yield put(groupsActions.groupsUpdate({}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else if (error.message === '400') {
      yield call(message.error, `Group with name "${name}" already exists`);
    } else {
      yield call(message.error, `Group Create Fail: ${error}`);
    }
  }
}

function* addUserToGroup(action: PayloadAction<AddUserGroupAction>) {
  try {
    const { groupId, username, groupName } = action.payload;
    yield call(addUserGroup, groupId, username);
    yield all([
      yield put(groupsActions.groupsUpdate({})),
      yield put(groupsActions.getGroup({ groupId: groupId })),
      yield put(clearUser()),
    ]);
    yield call(
      message.success,
      `User ${username} added into Group ${groupName}`
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Add user group fail: ${error}`);
    }
  }
}

function* removeUserFromGroup(action: PayloadAction<RemoveUserGroupAction>) {
  try {
    const { groupId, username, groupName } = action.payload;
    yield call(removeUserGroup, groupId, username);
    yield all([
      yield put(groupsActions.groupsUpdate({})),
      yield put(groupsActions.getGroup({ groupId: groupId })),
    ]);
    yield call(
      message.success,
      `User ${username} removed from Group ${groupName}`
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Remove user group fail: ${error}`);
    }
  }
}

function* deleteUserGroup(action: PayloadAction<DeleteGroupAction>) {
  try {
    const { groupId, groupName, history } = action.payload;
    const resp = yield call(deleteGroup, groupId);
    if (!resp.ok) {
      const data = yield resp.json();
      yield call(message.error, data.message);
      return;
    }
    history.goBack();
    yield put(groupsActions.groupReceived({ group: undefined }));
    yield put(groupsActions.groupsUpdate({}));
    yield call(message.success, `Group "${groupName}" deleted`);
    history.push('/groups');
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Delete group fail: ${error}`);
    }
  }
}

function* getUserGroup(action: PayloadAction<GetGroupAction>) {
  const { groupId, hideError } = action.payload;

  try {
    const data = yield call(getGroup, groupId);
    yield put(groupsActions.groupReceived({ group: data }));
  } catch (error) {
    if (hideError) {
      return;
    }
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Get Group Error Received: ${error}`);
    }
  }
}

function* patchGroup(action: PayloadAction<PatchGroupAction>) {
  try {
    const { groupId, name } = action.payload;
    const group = yield call(updateGroup, groupId, name);
    yield put(groupsActions.groupReceived({ group: group }));
    yield put(groupsActions.groupsUpdate({}));
  } catch (error) {
    const { name } = action.payload;
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else if (error.message === '400') {
      yield call(message.error, `Group with name "${name}" already exists`);
    } else {
      yield call(message.error, `Patch group Fail: ${error}`);
    }
  }
}

export default function* groupSagas() {
  yield all([
    yield takeLatest(
      groupsActions.groupsApiErrorReceived.type,
      apiErrorReceived
    ),
    yield takeLatest(groupsActions.groupsUpdate.type, groupsUpdate),
    yield takeLatest(groupsActions.createGroup.type, createGroup),
    yield takeLatest(groupsActions.addUserGroup.type, addUserToGroup),
    yield takeLatest(groupsActions.removeUserGroup.type, removeUserFromGroup),
    yield takeLatest(groupsActions.deleteGroup.type, deleteUserGroup),
    yield takeLatest(groupsActions.getGroup.type, getUserGroup),
    yield takeLatest(groupsActions.patchGroup.type, patchGroup),
    yield takeLatest(groupsActions.groupUpdate.type, groupUpdate),
  ]);
}
