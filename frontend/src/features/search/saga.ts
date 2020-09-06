import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {IState} from '../../store';
import {fetchSearchResults} from '../../apis/queryApis';
import {PayloadAction} from "redux-starter-kit";
import {actions as searchActions, SearchAction} from "./reducer";
import {SearchResult, searchResultPageSize} from "./interface";
import {reloadReceived} from "../myself/actions";

function* search(action: PayloadAction<SearchAction>) {
    try {
        const {term, scrollId} = action.payload;
        if (term.length < 3) {
            yield call(message.error, 'Please enter at least 3 characters to search');
            return;
        }
        const state: IState = yield select();
        let pageNo = state.search.searchPageNo;
        if (scrollId) {
            yield put(searchActions.updateLoadingMore({loadingMore: true}));
        } else {
            pageNo = 0;
            yield put(searchActions.updateSearching({searching: true}));
        }
        let data: SearchResult = yield call(fetchSearchResults,
            term, pageNo, searchResultPageSize, scrollId);
        if (scrollId) {
            const oldList = state.search.searchResult!.searchResultItemList;
            const result =
                data.searchResultItemList.concat(oldList);
            data.searchResultItemList = result;
        }
        yield put(searchActions.searchResultReceived({searchResult: data}));
        yield put(searchActions.updateSearchPageNo({
            searchPageNo: pageNo + 1
        }));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `search Error Received: ${error}`);
        }
    }
    yield put(searchActions.updateSearching({searching: false}));
    yield put(searchActions.updateLoadingMore({loadingMore: false}));
}

export default function* searchSagas() {
    yield all([
        yield takeLatest(searchActions.search.type, search),
    ]);
}