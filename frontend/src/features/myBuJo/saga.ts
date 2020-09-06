import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {fetchProjectItems, fetchRecentProjectItems,} from '../../apis/projectItemsApis';
import {
  actions as projectItemsActions,
  ApiErrorAction,
  GetProjectItemsAction,
  GetProjectItemsAfterUpdateSelectAction,
  MyBuJo,
} from './reducer';
import {IState} from '../../store';
import {PayloadAction} from 'redux-starter-kit';
import {ProjectType} from '../project/constants';
import moment from 'moment';
import {recentItemsReceived, updateRecentItemsDates} from '../recent/actions';
import {dateFormat} from './constants';
import {ProjectItem} from './interface';
import {reloadReceived} from "../myself/actions";

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(
    message.error,
    `ProjectItems Error Received: ${action.payload.error}`
  );
}

function* getProjectItems(action: PayloadAction<GetProjectItemsAction>) {
  try {
    const { startDate, endDate, timezone, category } = action.payload;

    const state: IState = yield select();

    let types = [] as ProjectType[];
    if (state.myBuJo.ledgerSelected) types.push(ProjectType.LEDGER);
    if (state.myBuJo.todoSelected) types.push(ProjectType.TODO);
    if (state.myBuJo.noteSelected) types.push(ProjectType.NOTE);

    if (!startDate || !endDate) return;

    if (category === 'calendar') {
      const calendarData = yield call(
        fetchProjectItems,
        types,
        timezone,
        startDate,
        endDate
      );
      yield put(
        projectItemsActions.projectItemsForCalenderReceived({
          items: calendarData,
        })
      );
    } else if (category === 'today') {
      const todayData = yield call(
        fetchProjectItems,
        types,
        timezone,
        startDate,
        endDate
      );
      yield put(projectItemsActions.projectItemsReceived({ items: todayData }));
    } else if (category === 'recent') {
      const recentItems: ProjectItem[] = yield call(
        fetchRecentProjectItems,
        types,
        timezone,
        startDate,
        endDate
      );
      yield put(updateRecentItemsDates(startDate, endDate));
      yield put(recentItemsReceived(recentItems));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Get ProjectItems Error Received: ${error}`);
    }
  }
}

function* getProjectItemsAfterUpdateSelect(
  action: PayloadAction<GetProjectItemsAfterUpdateSelectAction>
) {
  try {
    const {
      todoSelected,
      ledgerSelected,
      noteSelected,
      category,
      forceToday
    } = action.payload;

    const state: IState = yield select();

    let currentTime = new Date().toLocaleString('fr-CA', {
      timeZone: state.myself.timezone,
    });
    if (forceToday === true) {
      currentTime = currentTime.substring(0, 10);
      yield put(projectItemsActions.datesReceived({startDate: currentTime, endDate: currentTime}));
    }

    yield put(
      projectItemsActions.updateSelected({
        todoSelected: todoSelected,
        ledgerSelected: ledgerSelected,
        noteSelected: noteSelected,
      })
    );

    let types = [];
    if (ledgerSelected) types.push(ProjectType.LEDGER);
    if (todoSelected) types.push(ProjectType.TODO);
    if (noteSelected) types.push(ProjectType.NOTE);

    let data = [];

    if (category === 'calendar') {
      if (state.myBuJo.calendarMode === 'month') {
        data = yield call(
          fetchProjectItems,
          types,
          state.myself.timezone,
          moment(state.myBuJo.selectedCalendarDay)
            .add(-60, 'days')
            .format(dateFormat),
          moment(state.myBuJo.selectedCalendarDay)
            .add(60, 'days')
            .format(dateFormat)
        );
      } else {
        // calendarMode is 'year'
        const year = state.myBuJo.selectedCalendarDay.substring(0, 4);
        data = yield call(
          fetchProjectItems,
          types,
          state.myself.timezone,
          year + '-01-01',
          year + '-12-31'
        );
      }
      yield put(
        projectItemsActions.projectItemsForCalenderReceived({ items: data })
      );
    } else if (category === 'today') {
      data = yield call(
        fetchProjectItems,
        types,
        state.myself.timezone,
          forceToday === true ? currentTime : state.myBuJo.startDate,
          forceToday === true ? currentTime : state.myBuJo.endDate
      );
      yield put(projectItemsActions.projectItemsReceived({ items: data }));
    } else if (category === 'recent') {
      const recentItems: ProjectItem[] = yield call(
        fetchRecentProjectItems,
        types,
        state.myself.timezone,
        state.recent.startDate,
        state.recent.endDate
      );
      yield put(recentItemsReceived(recentItems));
    }
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `Get ProjectItems Error Received: ${error}`);
    }
  }
}

function* updateMyBuJoDates(action: PayloadAction<MyBuJo>) {
  try {
    const { startDate, endDate } = action.payload;

    const state: IState = yield select();
    const timezone = state.myself.timezone;

    let types = [] as ProjectType[];
    if (state.myBuJo.ledgerSelected) types.push(ProjectType.LEDGER);
    if (state.myBuJo.todoSelected) types.push(ProjectType.TODO);

    let data = [];
    if (!startDate || !endDate) return;
    yield put(projectItemsActions.datesReceived({startDate: startDate, endDate: endDate}));
    data = yield call(fetchProjectItems, types, timezone, startDate, endDate);

    yield put(projectItemsActions.projectItemsReceived({ items: data }));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `update Date Saga Error Received: ${error}`);
    }
  }
}

export default function* myBuJoSagas() {
  yield all([
    yield takeLatest(
      projectItemsActions.projectItemsApiErrorReceived.type,
      apiErrorReceived
    ),
    yield takeLatest(projectItemsActions.getProjectItems.type, getProjectItems),
    yield takeLatest(
      projectItemsActions.getProjectItemsAfterUpdateSelect.type,
      getProjectItemsAfterUpdateSelect
    ),
    yield takeLatest(projectItemsActions.updateMyBuJoDates.type, updateMyBuJoDates),
  ]);
}
