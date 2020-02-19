import { spawn } from 'redux-saga/effects';
import myselfSaga from '../features/myself/saga';
import notificationSaga from '../features/notification/saga';
import groupSaga from '../features/group/saga';
import projectSaga from '../features/project/saga';
import systemSaga from '../features/system/saga';
import userSaga from '../features/user/saga';

export default function* root() {
  yield spawn(myselfSaga);
  yield spawn(notificationSaga);
  yield spawn(groupSaga);
  yield spawn(projectSaga);
  yield spawn(systemSaga);
  yield spawn(userSaga);
}
