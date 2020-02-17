import { spawn } from 'redux-saga/effects';
import userSaga from '../features/user-info/saga';
import notificationSaga from '../features/notification/saga';
import groupSaga from '../features/group/saga';
import projectSaga from '../features/project/saga';

export default function* root() {
  yield spawn(userSaga);
  yield spawn(notificationSaga);
  yield spawn(groupSaga);
  yield spawn(projectSaga);
}
