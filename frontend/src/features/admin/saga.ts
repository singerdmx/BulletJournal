import { all, call, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import { PayloadAction } from 'redux-starter-kit';
import {
  actions as adminActions,
  setRoleAction,
  GetUsersByRoleAction,
  GetLockedUsersAndIPsAction,
  UnlockUserAndIPAction,
  LockUserAndIPAction,
  ChangePointsAction,
  SetPointsAction,
  GetUserInfoAction, GetCategoryStepsAction, ApproveSampleTaskAction,
} from './reducer';
import {
  setRole,
  changePoints,
  fetchUsersByRole,
  fetchBlockedUsersAndIPs,
  unlockUserAndIP,
  lockUserAndIP,
  fetchUserInfo,
  setPoints,
} from '../../apis/adminApis';
import {CategorySteps, UserInfo} from './interface';
import {auditSampleTask, fetchCategorySteps} from "../../apis/templates/workflowApis";
import {SampleTask} from "../templates/interface";
import {sampleTaskReceived} from "../templates/actions";

function* setUserRole(action: PayloadAction<setRoleAction>) {
  try {
    const { username, role } = action.payload;
    if (!username) {
      yield call(message.error, 'Missing Username');
      return;
    }
    yield call(setRole, username, role);
    yield call(message.success, `User ${username} is set to ${role}`);
  } catch (error) {
    yield call(message.error, `setRole Error Received: ${error}`);
  }
}

function* changeUserPoints(action: PayloadAction<ChangePointsAction>) {
  try {
    const { username, points, description } = action.payload;
    if (!username) {
      yield call(message.error, 'Missing Username');
      return;
    }
    const data = yield call(changePoints, username, points, description);
    yield put(adminActions.userInfoReceived({ userInfo: data }));
    yield call(
      message.success,
      `User ${username} changed(+/-) points ${points}`
    );
  } catch (error) {
    yield call(message.error, `Change Points Error Received: ${error}`);
  }
}

function* setUserPoints(action: PayloadAction<SetPointsAction>) {
  try {
    const { username, points } = action.payload;
    if (!username) {
      yield call(message.error, 'Missing Username');
      return;
    }
    yield call(setPoints, username, points);
    yield put(adminActions.userInfoPointsReceived({ points: points }));

    yield call(message.success, `User ${username} set points to ${points}`);
  } catch (error) {
    yield call(message.error, `set Points Error Received: ${error}`);
  }
}

function* getUsersByRole(action: PayloadAction<GetUsersByRoleAction>) {
  try {
    const { role } = action.payload;
    const data = yield call(fetchUsersByRole, role);
    yield put(adminActions.userRolesReceived({ usersByRole: data }));
  } catch (error) {
    yield call(message.error, `getUsersByRole Error Received: ${error}`);
  }
}

function* getUserInfo(action: PayloadAction<GetUserInfoAction>) {
  try {
    const { username } = action.payload;
    const data = yield call(fetchUserInfo, username);

    const userInfo = {
      id: data.id,
      name: data.name,
      timezone: data.timezone,
      currency: data.currency,
      theme: data.theme,
      points: data.points,
    } as UserInfo;
    yield put(adminActions.userInfoReceived({ userInfo: userInfo }));
  } catch (error) {
    yield call(message.error, `get User Info Error Received: ${error}`);
  }
}

function* getBlockedUsersAndIPs(
  action: PayloadAction<GetLockedUsersAndIPsAction>
) {
  try {
    const data = yield call(fetchBlockedUsersAndIPs);

    yield put(adminActions.lockedUsersReceived({ lockedUsers: data.users }));
    yield put(adminActions.lockedIPsReceived({ lockedIPs: data.ips }));
  } catch (error) {
    yield call(message.error, `getBlockedUsersAndIPs Error Received: ${error}`);
  }
}

function* unlockUsersAndIPs(action: PayloadAction<UnlockUserAndIPAction>) {
  const { name, ip } = action.payload;
  try {
    yield call(unlockUserAndIP, name, ip);

    //refresh block users list
    const data = yield call(fetchBlockedUsersAndIPs);
    if (name && name.length > 0)
      yield put(adminActions.lockedUsersReceived({ lockedUsers: data.users }));
    if (ip && ip.length > 0)
      yield put(adminActions.lockedIPsReceived({ lockedIPs: data.ips }));
  } catch (error) {
    yield call(message.error, `unlockUserandIP Error Received: ${error}`);
  }
}

function* lockUsersAndIPs(action: PayloadAction<LockUserAndIPAction>) {
  const { name, ip, reason } = action.payload;
  try {
    yield call(lockUserAndIP, name, ip, reason);
  } catch (error) {
    yield call(message.error, `unlockUserandIP Error Received: ${error}`);
  }
}

function* getCategorySteps(action: PayloadAction<GetCategoryStepsAction>) {
  const { categoryId } = action.payload;
  console.log(categoryId)
  try {
    const data : CategorySteps = yield call(fetchCategorySteps, categoryId);
    console.log(data);
    yield put(adminActions.categoryStepsReceived({categorySteps: data}));
  } catch (error) {
    yield call(message.error, `getCategorySteps Error Received: ${error}`);
  }
}

function* approveSampleTask(action: PayloadAction<ApproveSampleTaskAction>) {
  const { sampleTaskId, choiceId, selections } = action.payload;
  try {
    const data : SampleTask = yield call(auditSampleTask, sampleTaskId, choiceId, selections);
    yield put(sampleTaskReceived(data));
  } catch (error) {
    yield call(message.error, `approveSampleTask Error Received: ${error}`);
  }
}

export default function* AdminSagas() {
  yield all([
    yield takeLatest(adminActions.setRole.type, setUserRole),
    yield takeLatest(adminActions.changePoints.type, changeUserPoints),
    yield takeLatest(adminActions.getUsersByRole.type, getUsersByRole),
    yield takeLatest(
         adminActions.getLockedUsersAndIPs.type,
         getBlockedUsersAndIPs
       ),
    yield takeLatest(adminActions.unlockUserandIP.type, unlockUsersAndIPs),
    yield takeLatest(adminActions.lockUserandIP.type, lockUsersAndIPs),
    yield takeLatest(adminActions.getUserInfo.type, getUserInfo),
    yield takeLatest(adminActions.getCategorySteps.type, getCategorySteps),
    yield takeLatest(adminActions.approveSampleTask.type, approveSampleTask),
  ])
}
