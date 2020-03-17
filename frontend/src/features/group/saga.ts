import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as groupsActions,
  ApiErrorAction,
  GroupsAction,
  GroupCreateAction,
  AddUserGroupAction,
  RemoveUserGroupAction,
  DeleteGroupAction,
  GetGroupAction,
  PatchGroupAction,
  GroupUpdateAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchGroups,
  addGroup,
  addUserGroup,
  removeUserGroup,
  deleteGroup,
  getGroup,
  updateGroup
} from '../../apis/groupApis';
import { IState } from '../../store';
import { clearUser } from '../user/actions';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(message.error, `Group Error Received: ${action.payload.error}`);
}

function* groupsUpdate(action: PayloadAction<GroupsAction>) {
  try {
    //get etag from header
    const data = yield call(fetchGroups);
    const etag = data.headers.get('Etag')!;
    const groups = yield data.json();
    console.log(groups);

    yield put(groupsActions.groupsReceived({ groups: groups, etag: etag }));
  } catch (error) {
    yield call(message.error, `Group Error Received: ${error}`);
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
    if (error.message === '400') {
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
      yield put(clearUser())
    ]);
    yield call(
      message.success,
      `User ${username} added into Group ${groupName}`
    );
  } catch (error) {
    yield call(message.error, `Add user group fail: ${error}`);
  }
}

function* removeUserFromGroup(action: PayloadAction<RemoveUserGroupAction>) {
  try {
    const { groupId, username, groupName } = action.payload;
    yield call(removeUserGroup, groupId, username);
    yield all([
      yield put(groupsActions.groupsUpdate({})),
      yield put(groupsActions.getGroup({ groupId: groupId }))
    ]);
    yield call(
      message.success,
      `User ${username} removed from Group ${groupName}`
    );
  } catch (error) {
    yield call(message.error, `Remove user group fail: ${error}`);
  }
}

function* deleteUserGroup(action: PayloadAction<DeleteGroupAction>) {
  try {
    const { groupId, groupName, history } = action.payload;
    history.goBack();
    yield call(deleteGroup, groupId);
    yield put(groupsActions.groupsUpdate({}));
    yield call(message.success, `Group "${groupName}" deleted`);
    history.push('/groups');
  } catch (error) {
    yield call(message.error, `Delete group fail: ${error}`);
  }
}

function* getUserGroup(action: PayloadAction<GetGroupAction>) {
  const { groupId, hideError } = action.payload;

  try {
    const data = yield call(getGroup, groupId);
    console.log(data);
    yield put(groupsActions.groupReceived({ group: data }));
  } catch (error) {
    if (hideError) {
      return;
    }
    yield call(message.error, `Get Group Error Received: ${error}`);
  }
}

function* patchGroup(action: PayloadAction<PatchGroupAction>) {
  try {
    const { groupId, name } = action.payload;
    const group = yield call(updateGroup, groupId, name);
    yield put(groupsActions.groupReceived({ group: group }));
    yield put(groupsActions.groupsUpdate({}));
  } catch (error) {
    yield call(message.error, `Patch group Fail: ${error}`);
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
    yield takeLatest(groupsActions.groupUpdate.type, groupUpdate)
  ]);
}
