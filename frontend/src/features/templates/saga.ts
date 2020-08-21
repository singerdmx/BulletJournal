import {all, call, put, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {PayloadAction} from 'redux-starter-kit';
import {actions as templatesActions, AddCategoryAction, GetCategoriesAction} from './reducer';
import {createCategory, getCategories} from '../../apis/templates/categoryApis';
import {Category} from './interface';

function* fetchCategories(action: PayloadAction<GetCategoriesAction>) {
  try {
    const data: Category[] = yield call(getCategories);
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    yield call(message.error, `fetchCategories Error Received: ${error}`);
  }
}

function* addCategory(action: PayloadAction<AddCategoryAction>) {
  try {
    const {name, description} = action.payload;
    yield call(createCategory, name, description);
    const data: Category[] = yield call(getCategories);
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    yield call(message.error, `addCategory Error Received: ${error}`);
  }
}

export default function* TemplatesSagas() {
  yield all([
    yield takeLatest(templatesActions.getCategories.type, fetchCategories),
    yield takeLatest(templatesActions.addCategory.type, addCategory)
  ])
}
