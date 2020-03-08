import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
    fetchProjectItems
} from '../../apis/projectItemsApis';
import {
    actions as projectItemsActions,
    ApiErrorAction,
    GetProjectItemsAction,
} from "./reducer";
import {PayloadAction} from "redux-starter-kit";

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
    yield call(message.error, `ProjectItems Error Received: ${action.payload.error}`);
}

function* getProjectItems(action: PayloadAction<GetProjectItemsAction>) {
    try {
        const { types, startDate, endDate, timezone } = action.payload;
        const data = yield call(fetchProjectItems, types, timezone, startDate, endDate);
        yield put(projectItemsActions.projectItemsReceived({items: data}));
    } catch (error) {
        yield call(message.error, `Get ProjectItems Error Received: ${error}`);
    }
}

export default function* labelSagas() {
    yield all([
        yield takeLatest(
            projectItemsActions.projectItemsApiErrorReceived.type,
            apiErrorReceived),
        yield takeLatest(
            projectItemsActions.getProjectItems.type,
            getProjectItems),
    ]);
}