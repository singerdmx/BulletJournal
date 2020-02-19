import { takeEvery, takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as groupsActions,
  ApiErrorAction,
  GroupsAction,
  GroupCreateAction,
  AddUserGroupAction,
  RemoveUserGroupAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchGroups,
  createGroups,
  addUserGroup,
  removeUserGroup
} from '../../apis/groupApis';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(message.error, `Group Error Received: ${action.payload.error}`);
}

function* groupsUpdate(action: PayloadAction<GroupsAction>) {
  try {
    //get etag from header
    const data = yield call(fetchGroups);
    const etag = data.headers.get("Etag")!;
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
    yield call(createGroups, name);
    yield call(message.success, `${name} Group Created`);
  } catch (error) {
    yield call(message.error, `Group Create Fail: ${error}`);
  }
}

function* addUserToGroup(action: PayloadAction<AddUserGroupAction>) {
  try {
    const { groupId, username } = action.payload;
    yield call(addUserGroup, groupId, username);
    yield call(message.success, `User ${username} added into Group ${groupId}`);
  } catch (error) {
    yield call(message.error, `Add user group fail: ${error}`);
  }
}

function* removeUserFromGroup(action: PayloadAction<RemoveUserGroupAction>) {
  try {
    const { groupId, username } = action.payload;
    yield call(removeUserGroup, groupId, username);
    yield call(
      message.success,
      `User ${username} removed from Group ${groupId}`
    );
  } catch (error) {
    yield call(message.error, `Remove user group fail: ${error}`);
  }
}

export default function* groupSagas() {
  yield all([
    yield takeEvery(
      groupsActions.groupsApiErrorReceived.type,
      apiErrorReceived
    ),
    yield takeEvery(groupsActions.groupsUpdate.type, groupsUpdate),
    yield takeEvery(groupsActions.createGroup.type, createGroup),
    yield takeLatest(groupsActions.addUserGroup.type, addUserToGroup),
    yield takeLatest(groupsActions.removeUserGroup.type, removeUserFromGroup)
  ]);
}
