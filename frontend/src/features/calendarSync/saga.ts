import {all, call, put, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {
  actions as calendarSyncActions,
  UpdateExpirationTimeAction,
  UpdateGoogleCalendarEventListAction
} from './reducer';
import {PayloadAction} from 'redux-starter-kit';
import {getGoogleCalendarEventList, getGoogleCalendarList, getGoogleCalendarLoginStatus} from "../../apis/calendarApis";
import {CalendarListEntry, LoginStatus} from "./interface";

function* googleTokenExpirationTimeUpdate(action: PayloadAction<UpdateExpirationTimeAction>) {
  try {
    const loginStatus: LoginStatus = yield call(getGoogleCalendarLoginStatus);
    const expirationTime = loginStatus.loggedIn ? loginStatus.expirationTime : 0;
    yield put(calendarSyncActions.googleTokenExpirationTimeReceived({expirationTime: expirationTime}));
    if (expirationTime) {
      const calendarList : CalendarListEntry[] = yield call(getGoogleCalendarList);
      yield put(calendarSyncActions.googleCalendarListReceived({calendarList: calendarList}));
    }
  } catch (error) {
    yield call(message.error, `googleTokenExpirationTimeUpdate Error Received: ${error}`);
  }
}

function* googleCalendarEventListUpdate(action: PayloadAction<UpdateGoogleCalendarEventListAction>) {
  try {
    const {calendarId, timezone, startDate, endDate} = action.payload;
    const data = yield call(getGoogleCalendarEventList, calendarId, timezone, startDate, endDate);
    yield put(calendarSyncActions.googleCalendarEventListReceived({googleCalendarEventList: data}));
  } catch (error) {
    yield call(message.error, `googleTokenExpirationTimeUpdate Error Received: ${error}`);
  }
}

export default function* calendarSyncSagas() {
  yield all([
    yield takeLatest(calendarSyncActions.googleTokenExpirationTimeUpdate.type, googleTokenExpirationTimeUpdate),
    yield takeLatest(calendarSyncActions.googleCalendarEventListUpdate.type, googleCalendarEventListUpdate)
  ]);
}
