import {all, call, put, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {PayloadAction} from 'redux-starter-kit';
import {
  actions as templatesActions,
  AddCategoryAction,
  DeleteCategoryAction,
  GetCategoriesAction,
  UpdateCategoryRelationsAction
} from './reducer';
import {createCategory, deleteCategory, getCategories, putCategories} from '../../apis/templates/categoryApis';
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

function* removeCategory(action: PayloadAction<DeleteCategoryAction>) {
  try {
    const {id} = action.payload;
    const data: Category[] = yield call(deleteCategory, id);
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    yield call(message.error, `removeCategory Error Received: ${error}`);
  }
}

function* updateCategories(action: PayloadAction<UpdateCategoryRelationsAction>) {
  try {
    const {categories} = action.payload;
    const data: Category[] = yield call(putCategories, categories);
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    yield call(message.error, `updateCategories Error Received: ${error}`);
  }
}

export default function* TemplatesSagas() {
  yield all([
    yield takeLatest(templatesActions.getCategories.type, fetchCategories),
    yield takeLatest(templatesActions.addCategory.type, addCategory),
    yield takeLatest(templatesActions.updateCategoryRelations.type, updateCategories),
    yield takeLatest(templatesActions.deleteCategory.type, removeCategory),
  ])
}
