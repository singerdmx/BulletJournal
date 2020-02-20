import { takeEvery, takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as groupsActions,
  ApiErrorAction,
  GroupsAction,
  GroupCreateAction,
  AddUserGroupAction,
  RemoveUserGroupAction,
  DeleteGroupAction,
  GetGroupAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchGroups,
  createGroups,
  addUserGroup,
  removeUserGroup,
  deleteGroup,
  getGroup
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

function* deleteUserGroup(action: PayloadAction<DeleteGroupAction>) {
  try {
    const { groupId } = action.payload;
    yield call(deleteGroup, groupId);
    yield call(message.success, `Group ${groupId} deleted`);
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

export default function* groupSagas() {
  yield all([
    yield takeEvery(
      groupsActions.groupsApiErrorReceived.type,
      apiErrorReceived
    ),
    yield takeEvery(groupsActions.groupsUpdate.type, groupsUpdate),
    yield takeEvery(groupsActions.createGroup.type, createGroup),
    yield takeLatest(groupsActions.addUserGroup.type, addUserToGroup),
    yield takeLatest(groupsActions.removeUserGroup.type, removeUserFromGroup),
    yield takeLatest(groupsActions.deleteGroup.type, deleteUserGroup),
    yield takeLatest(groupsActions.getGroup.type, getUserGroup)
  ]);
}
