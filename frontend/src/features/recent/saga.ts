import { PayloadAction } from 'redux-starter-kit';
import { IState } from '../../store';
import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { ProjectType } from '../project/constants';
import { fetchRecentProjectItems } from '../../apis/projectItemsApis';
import { message } from 'antd';
import { actions as recentActions, DatesReceivedAction } from './reducer';
import {reloadReceived} from "../myself/actions";

function* updateRecentDates(action: PayloadAction<DatesReceivedAction>) {
  try {
    const { startDate, endDate } = action.payload;

    const state: IState = yield select();
    const timezone = state.myself.timezone;
    if (!timezone) return;

    let types = [] as ProjectType[];
    if (state.myBuJo.ledgerSelected) types.push(ProjectType.LEDGER);
    if (state.myBuJo.todoSelected) types.push(ProjectType.TODO);
    if (state.myBuJo.noteSelected) types.push(ProjectType.NOTE);

    let data = [];
    if (!startDate || !endDate) return;

    data = yield call(
      fetchRecentProjectItems,
      types,
      timezone,
      startDate,
      endDate
    );
    yield put(recentActions.recentItemsReceived({ items: data }));
    yield put(
      recentActions.datesReceived({ startDate: startDate, endDate: endDate })
    );
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `updateRecentDates Error Received: ${error}`);
    }
  }
}

export default function* recentSagas() {
  yield all([
    yield takeLatest(recentActions.updateRecentDates.type, updateRecentDates),
  ]);
}
