import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {IState} from '../../store';
import {fetchSearchResults} from '../../apis/queryApis';
import {PayloadAction} from "redux-starter-kit";
import {actions as searchActions, SearchAction} from "./reducer";
import {SearchResult, searchResultPageSize} from "./interface";

function* search(action: PayloadAction<SearchAction>) {
    try {
        const {term, scrollId} = action.payload;
        const state: IState = yield select();
        const data: SearchResult = yield call(fetchSearchResults,
            term, state.search.searchPageNo, searchResultPageSize, scrollId);
        yield put(searchActions.searchResultReceived({searchResult: data}));
        yield put(searchActions.updateSearchPageNo({
            scrollId: data.scrollId,
            searchPageNo: state.search.searchPageNo + 1
        }));
    } catch (error) {
        yield call(message.error, `search Error Received: ${error}`);
    }
}

export default function* searchSagas() {
    yield all([
        yield takeLatest(searchActions.search.type, search),
    ]);
}