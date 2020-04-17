import {all, call, put, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {
  actions as calendarSyncActions, GoogleCalendarCreateEventsAction,
  UpdateExpirationTimeAction,
  UpdateGoogleCalendarEventListAction, UpdateWatchedProjectAction
} from './reducer';
import {PayloadAction} from 'redux-starter-kit';
import {
  createGoogleCalendarEvents,
  getGoogleCalendarEventList,
  getGoogleCalendarList,
  getGoogleCalendarLoginStatus, getWatchedProject
} from "../../apis/calendarApis";
import {CalendarListEntry, LoginStatus} from "./interface";
import {Project} from "../project/interface";

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
    yield call(message.error, `googleCalendarEventListUpdate Error Received: ${error}`);
  }
}

function* googleCalendarCreateEvents(action: PayloadAction<GoogleCalendarCreateEventsAction>) {
  try {
    const {projectId, events} = action.payload;
    yield call(createGoogleCalendarEvents, projectId, events);
  } catch (error) {
    yield call(message.error, `googleCalendarCreateEvents Error Received: ${error}`);
  }
}

function* updateWatchedProject(action: PayloadAction<UpdateWatchedProjectAction>) {
  try {
    const {calendarId} = action.payload;
    const project : Project = yield call(getWatchedProject, calendarId);
    yield put(calendarSyncActions.watchedProjectReceived({project: project}));
  } catch (error) {
    yield call(message.error, `updateWatchedProject Error Received: ${error}`);
  }
}

export default function* calendarSyncSagas() {
  yield all([
    yield takeLatest(calendarSyncActions.googleTokenExpirationTimeUpdate.type, googleTokenExpirationTimeUpdate),
    yield takeLatest(calendarSyncActions.googleCalendarEventListUpdate.type, googleCalendarEventListUpdate),
    yield takeLatest(calendarSyncActions.googleCalendarCreateEvents.type, googleCalendarCreateEvents),
    yield takeLatest(calendarSyncActions.watchedProjectUpdate.type, updateWatchedProject)
  ]);
}
