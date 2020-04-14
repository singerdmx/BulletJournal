import {all, call, put, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {actions as calendarSyncActions, UpdateExpirationTimeAction} from './reducer';
import {PayloadAction} from 'redux-starter-kit';
import {getGoogleCalendarLoginStatus} from "../../apis/calendarApis";
import {LoginStatus} from "./interface";

function* googleTokenExpirationTimeUpdate(action: PayloadAction<UpdateExpirationTimeAction>) {
  try {
    const loginStatus: LoginStatus = yield call(getGoogleCalendarLoginStatus);
    const expirationTime = loginStatus.loggedIn ? loginStatus.expirationTime : 0;
    yield put(calendarSyncActions.googleTokenExpirationTimeReceived({expirationTime: expirationTime}));
  } catch (error) {
    yield call(message.error, `googleTokenExpirationTimeUpdate Error Received: ${error}`);
  }
}

export default function* calendarSyncSagas() {
  yield all([
    yield takeLatest(calendarSyncActions.googleTokenExpirationTimeUpdate.type, googleTokenExpirationTimeUpdate)
  ]);
}
