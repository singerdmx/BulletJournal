import { spawn } from 'redux-saga/effects';
import myselfSaga from '../features/myself/saga';
import notificationSaga from '../features/notification/saga';
import groupSaga from '../features/group/saga';
import projectSaga from '../features/project/saga';
import systemSaga from '../features/system/saga';
import userSaga from '../features/user/saga';
import noteSaga from '../features/notes/saga';
import labelSaga from '../features/label/saga';
import myBuJoSagas from '../features/myBuJo/saga';
import rRuleSagas from '../features/rrule/saga';

export default function* root() {
  yield spawn(myselfSaga);
  yield spawn(notificationSaga);
  yield spawn(groupSaga);
  yield spawn(projectSaga);
  yield spawn(systemSaga);
  yield spawn(userSaga);
  yield spawn(noteSaga);
  yield spawn(labelSaga);
  yield spawn(myBuJoSagas);
  yield spawn(rRuleSagas);
}
