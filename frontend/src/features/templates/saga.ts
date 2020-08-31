import {all, call, put, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {PayloadAction} from 'redux-starter-kit';
import {
  actions as templatesActions,
  AddCategoryAction,
  DeleteCategoryAction,
  GetCategoriesAction, GetCategoryAction, GetChoicesAction, SetChoicesAction, UpdateCategoryAction,
  UpdateCategoryRelationsAction
} from './reducer';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  putCategories,
  putCategory,
  updateChoicesForCategory
} from '../../apis/templates/categoryApis';
import {
  getChoices
} from '../../apis/templates/choiceApis';
import {Category, Choice} from './interface';

function* fetchCategories(action: PayloadAction<GetCategoriesAction>) {
  try {
    const data: Category[] = yield call(getCategories);
    console.log(data)
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    yield call(message.error, `fetchCategories Error Received: ${error}`);
  }
}

function* fetchChoices(action: PayloadAction<GetChoicesAction>) {
  try {
    console.log('XXX')
    const data: Choice[] = yield call(getChoices);
    console.log(data)
    yield put(templatesActions.choicesReceived({choices: data}));
  } catch (error) {
    yield call(message.error, `fetchChoices Error Received: ${error}`);
  }
}

function* fetchCategory(action: PayloadAction<GetCategoryAction>) {
  try {
    const {categoryId} = action.payload;
    const data: Category = yield call(getCategory, categoryId);
    console.log(data)
    yield put(templatesActions.categoryReceived({category: data}));
  } catch (error) {
    yield call(message.error, `fetchCategory Error Received: ${error}`);
  }
}

function* addCategory(action: PayloadAction<AddCategoryAction>) {
  try {
    console.log(action.payload)
    const {name, description, icon, color, forumId, image} = action.payload;
    yield call(createCategory, name, description, icon, color, forumId, image);
    const data: Category[] = yield call(getCategories);
    yield put(templatesActions.categoriesReceived({categories: data}));
  } catch (error) {
    yield call(message.error, `addCategory Error Received: ${error}`);
  }
}

function* updateCategory(action: PayloadAction<UpdateCategoryAction>) {
  try {
    const {categoryId, name, description, icon, color, forumId, image} = action.payload;
    const data: Category = yield call(putCategory, categoryId, name, description, icon, color, forumId, image);
    yield put(templatesActions.categoryReceived({category: data}));
  } catch (error) {
    yield call(message.error, `updateCategory Error Received: ${error}`);
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

function* setChoices(action: PayloadAction<SetChoicesAction>) {
  try {
    const {categoryId, choices} = action.payload;
    const data: Category = yield call(updateChoicesForCategory, categoryId, choices);
    console.log(data)
    yield put(templatesActions.categoryReceived({category: data}));
  } catch (error) {
    yield call(message.error, `setChoices Error Received: ${error}`);
  }
}

export default function* TemplatesSagas() {
  yield all([
    yield takeLatest(templatesActions.getCategories.type, fetchCategories),
    yield takeLatest(templatesActions.getChoices.type, fetchChoices),
    yield takeLatest(templatesActions.addCategory.type, addCategory),
    yield takeLatest(templatesActions.updateCategoryRelations.type, updateCategories),
    yield takeLatest(templatesActions.deleteCategory.type, removeCategory),
    yield takeLatest(templatesActions.updateCategory.type, updateCategory),
    yield takeLatest(templatesActions.getCategory.type, fetchCategory),
    yield takeLatest(templatesActions.setChoices.type, setChoices),
  ])
}
