import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import { fetchProjectItems } from '../../apis/projectItemsApis';
import {
  actions as projectItemsActions,
  ApiErrorAction,
  GetProjectItemsAction,
  GetProjectItemsAfterUpdateSelectAction,
  MyBuJo,
} from './reducer';
import { IState } from '../../store';
import { PayloadAction } from 'redux-starter-kit';
import { ProjectType } from '../project/constants';
import moment from 'moment';
import { dateFormat } from './constants';

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

    let data = [];
    if (!startDate || !endDate) return;

    data = yield call(fetchProjectItems, types, timezone, startDate, endDate);
    if (category === 'calendar') {
      yield put(
        projectItemsActions.projectItemsForCalenderReceived({ items: data })
      );
    } else {
      yield put(projectItemsActions.projectItemsReceived({ items: data }));
    }
  } catch (error) {
    yield call(message.error, `Get ProjectItems Error Received: ${error}`);
  }
}

function* getProjectItemsAfterUpdateSelect(
  action: PayloadAction<GetProjectItemsAfterUpdateSelectAction>
) {
  try {
    const { todoSelected, ledgerSelected, category } = action.payload;

    yield put(
      projectItemsActions.updateSelected({
        todoSelected: todoSelected,
        ledgerSelected: ledgerSelected,
      })
    );

    let types = [];
    if (ledgerSelected) types.push(ProjectType.LEDGER);
    if (todoSelected) types.push(ProjectType.TODO);

    let data = [];
    const state: IState = yield select();

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
    } else {
      data = yield call(
        fetchProjectItems,
        types,
        state.myself.timezone,
        state.myBuJo.startDate,
        state.myBuJo.endDate
      );
      yield put(projectItemsActions.projectItemsReceived({ items: data }));
    }
  } catch (error) {
    yield call(message.error, `Get ProjectItems Error Received: ${error}`);
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

    data = yield call(fetchProjectItems, types, timezone, startDate, endDate);

    yield put(projectItemsActions.projectItemsReceived({ items: data }));
  } catch (error) {
    yield call(message.error, `update Date Saga Error Received: ${error}`);
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
    yield takeLatest(
      projectItemsActions.getProjectItemsAfterUpdateSelect.type,
      getProjectItemsAfterUpdateSelect
    ),
    yield takeLatest(projectItemsActions.datesReceived.type, updateMyBuJoDates),
  ]);
}
