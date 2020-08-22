import { spawn } from 'redux-saga/effects';
import myselfSaga from '../features/myself/saga';
import notificationSaga from '../features/notification/saga';
import groupSaga from '../features/group/saga';
import projectSaga from '../features/project/saga';
import systemSaga from '../features/system/saga';
import userSaga from '../features/user/saga';
import noteSaga from '../features/notes/saga';
import labelSaga from '../features/label/saga';
import myBuJoSaga from '../features/myBuJo/saga';
import rRuleSaga from '../features/recurrence/saga';
import taskSaga from '../features/tasks/saga';
import transactionSaga from '../features/transactions/saga';
import calendarSyncSaga from '../features/calendarSync/saga';
import adminSaga from '../features/admin/saga';
import recentSaga from '../features/recent/saga';
import searchSaga from '../features/search/saga';
import templatesSaga from '../features/templates/saga';

export default function* root() {
  yield spawn(myselfSaga);
  yield spawn(notificationSaga);
  yield spawn(groupSaga);
  yield spawn(projectSaga);
  yield spawn(systemSaga);
  yield spawn(userSaga);
  yield spawn(noteSaga);
  yield spawn(labelSaga);
  yield spawn(myBuJoSaga);
  yield spawn(rRuleSaga);
  yield spawn(taskSaga);
  yield spawn(transactionSaga);
  yield spawn(calendarSyncSaga);
  yield spawn(adminSaga);
  yield spawn(recentSaga);
  yield spawn(searchSaga);
  yield spawn(templatesSaga);
}
