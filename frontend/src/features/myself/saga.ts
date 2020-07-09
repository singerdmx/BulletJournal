import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as myselfActions,
  MyselfApiErrorAction,
  UpdateMyself,
  PatchMyself,
  ThemeUpdate,
  UpdateExpandedMyself,
} from './reducer';
import { IState } from '../../store';
import { actions as settingsActions } from '../../components/settings/reducer';
import {
  updateMyBuJoDates,
  updateSelectedCalendarDay,
  getProjectItems,
} from '../../features/myBuJo/actions';
import { PayloadAction } from 'redux-starter-kit';
import { fetchMyself, patchMyself } from '../../apis/myselfApis';
import moment from 'moment';
import { dateFormat } from '../myBuJo/constants';
import { expandedMyselfLoading } from './actions';

function* myselfApiErrorAction(action: PayloadAction<MyselfApiErrorAction>) {
  yield call(message.error, `Myself Error Received: ${action.payload.error}`);
}

function* getExpandedMyself(action: PayloadAction<UpdateExpandedMyself>) {
  try {
    const { updateSettings } = action.payload;

    const data = yield call(fetchMyself, true);
    let currentTime = new Date().toLocaleString('fr-CA', {
      timeZone: data.timezone,
    });
    if (currentTime) currentTime = currentTime.substring(0, 10);

    yield put(
      myselfActions.myselfDataReceived({
        username: data.name,
        avatar: data.avatar,
        timezone: data.timezone,
        before: data.reminderBeforeTask,
        currency: data.currency,
        theme: data.theme,
        points: data.points,
        firstTime: data.firstTime,
      })
    );
    const state: IState = yield select();

    if (state.myBuJo.startDate) return;

    yield put(updateMyBuJoDates(currentTime, currentTime));

    yield put(updateSelectedCalendarDay(currentTime));
    yield put(
      getProjectItems(
        moment(new Date()).add(-60, 'days').format(dateFormat),
        moment(new Date()).add(60, 'days').format(dateFormat),
        data.timezone,
        'calendar'
      )
    );

    if (updateSettings) {
      yield put(settingsActions.updateTimezone({ timezone: data.timezone }));
      yield put(
        settingsActions.updateBefore({ before: data.reminderBeforeTask })
      );
      yield put(settingsActions.updateCurrency({ currency: data.currency }));
      yield put(settingsActions.updateTheme({ theme: data.theme }));
    }
  } catch (error) {
    yield call(message.error, `Myself (Expand) Error Received: ${error}`);
  }
}

function* updateTheme(action: PayloadAction<ThemeUpdate>) {
  try {
    yield put(expandedMyselfLoading(true));
    const data = yield call(fetchMyself, true);
    yield put(
      myselfActions.myselfDataReceived({
        username: data.name,
        avatar: data.avatar,
        timezone: data.timezone,
        before: data.reminderBeforeTask,
        currency: data.currency,
        theme: data.theme,
      })
    );
    yield put(expandedMyselfLoading(false));
  } catch (error) {
    yield put(expandedMyselfLoading(false));
    yield call(message.error, `Update Theme  Error Received: ${error}`);
  }
}

function* myselfUpdate(action: PayloadAction<UpdateMyself>) {
  try {
    const data = yield call(fetchMyself);

    yield put(
      myselfActions.myselfDataReceived({
        username: data.name,
        avatar: data.avatar,
      })
    );
  } catch (error) {
    yield call(message.error, `Myself Error Received: ${error}`);
  }
}

function* myselfPatch(action: PayloadAction<PatchMyself>) {
  try {
    const { timezone, before, currency, theme } = action.payload;
    yield call(patchMyself, timezone, before, currency, theme);
    let currentTime = new Date().toLocaleString('fr-CA', {
      timeZone: timezone,
    });
    if (currentTime) currentTime = currentTime.substring(0, 10);
    yield put(
      myselfActions.myselfDataReceived({
        timezone: timezone,
        before: before,
        currency: currency,
        theme: theme,
      })
    );
    yield put(updateMyBuJoDates(currentTime, currentTime));
    yield call(message.success, 'User Settings updated successfully');
  } catch (error) {
    yield call(message.error, `Myself Patch Error Received: ${error}`);
  }
}

export default function* myselfSagas() {
  yield all([
    yield takeLatest(
      myselfActions.myselfApiErrorReceived.type,
      myselfApiErrorAction
    ),
    yield takeLatest(myselfActions.myselfUpdate.type, myselfUpdate),
    yield takeLatest(myselfActions.patchMyself.type, myselfPatch),
    yield takeLatest(
      myselfActions.expandedMyselfUpdate.type,
      getExpandedMyself
    ),
    yield takeLatest(myselfActions.themeUpdate.type, updateTheme),
  ]);
}
