import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import { fetchProjectItems } from '../../apis/projectItemsApis';
import {
  actions as projectItemsActions,
  ApiErrorAction,
  GetProjectItemsAction,
  GetProjectItemsAfterUpdateSelectAction
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { ProjectType } from '../project/constants';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(
    message.error,
    `ProjectItems Error Received: ${action.payload.error}`
  );
}

function* getProjectItems(action: PayloadAction<GetProjectItemsAction>) {
  try {
    const { types, startDate, endDate, timezone } = action.payload;
    let data = [];
    if (types.length > 0) {
      data = yield call(fetchProjectItems, types, timezone, startDate, endDate);
    }
    yield put(projectItemsActions.projectItemsReceived({ items: data }));
  } catch (error) {
    yield call(message.error, `Get ProjectItems Error Received: ${error}`);
  }
}

function* getProjectItemsAfterUpdateSelect(
  action: PayloadAction<GetProjectItemsAfterUpdateSelectAction>
) {
  try {
    const {
      startDate,
      endDate,
      timezone,
      todoSelected,
      ledgerSelected
    } = action.payload;

    yield put(
      projectItemsActions.updateSelected({
        todoSelected: todoSelected,
        ledgerSelected: ledgerSelected
      })
    );

    let types = [];
    if (ledgerSelected) types.push(ProjectType.LEDGER);
    if (todoSelected) types.push(ProjectType.TODO);

    let data = [];
    if (types.length > 0) {
      data = yield call(fetchProjectItems, types, timezone, startDate, endDate);
    }
    yield put(projectItemsActions.projectItemsReceived({ items: data }));
  } catch (error) {
    yield call(message.error, `Get ProjectItems Error Received: ${error}`);
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
    )
  ]);
}
