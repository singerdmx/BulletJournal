import { takeLatest, call, all, put } from 'redux-saga/effects';
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
  PatchGroupAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchGroups,
  createGroups,
  addUserGroup,
  removeUserGroup,
  deleteGroup,
  getGroup,
  updateGroup
} from '../../apis/groupApis';

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

function* createGroup(action: PayloadAction<GroupCreateAction>) {
  try {
    const name = action.payload.name;
    const data = yield call(createGroups, name);
    yield put(groupsActions.groupReceived({ group: data }));
    yield put(groupsActions.groupsUpdate({}));
  } catch (error) {
    yield call(message.error, `Group Create Fail: ${error}`);
  }
}

function* addUserToGroup(action: PayloadAction<AddUserGroupAction>) {
  try {
    const { groupId, username, groupName } = action.payload;
    yield call(addUserGroup, groupId, username);
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
    const { groupId, groupName } = action.payload;
    yield call(deleteGroup, groupId);
    yield put(groupsActions.groupsUpdate({}));
    yield call(message.success, `Group "${groupName}" deleted`);
  } catch (error) {
    yield call(message.error, `Delete group fail: ${error}`);
  }
}

function* getUserGroup(action: PayloadAction<GetGroupAction>) {
  try {
    const { groupId } = action.payload;
    const data = yield call(getGroup, groupId);
    console.log(data);
    yield put(groupsActions.groupReceived({ group: data }));
  } catch (error) {
    yield call(message.error, `Get Group Error Received: ${error}`);
  }
}

function* patchGroup(action: PayloadAction<PatchGroupAction>) {
  try {
    const { groupId, name } = action.payload;
    const group = yield call(updateGroup, groupId, name);
    yield put(groupsActions.groupReceived({ group: group }));
    yield call(message.success, 'Successfully updated group');
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
    yield takeLatest(groupsActions.patchGroup.type, patchGroup)
  ]);
}
