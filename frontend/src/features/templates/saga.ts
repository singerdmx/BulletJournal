import { all, call, put, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import { PayloadAction } from 'redux-starter-kit';
import {
  actions as templatesActions,
  GetCategoriesAction
} from './reducer';
import {
  getCategories
} from '../../apis/templates/categoryApis';
import { Category } from './interface';

function* fetchCategories(action: PayloadAction<GetCategoriesAction>) {
  try {
    const data : Category[] = yield call(getCategories);
    yield put(templatesActions.categoriesReceived({ categories: data }));
  } catch (error) {
    yield call(message.error, `fetchCategories Error Received: ${error}`);
  }
}

export default function* TemplatesSagas() {
  yield all([
    yield takeLatest(templatesActions.getCategories.type, fetchCategories)
  ])
}
