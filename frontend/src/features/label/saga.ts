import { takeLatest, call, all, put, select } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as labelActions,
  ApiErrorAction,
  LabelCreateAction,
  DeleteLabelAction,
  PatchLabelAction,
  UpdateLabels,
  GetItemsByLabelsAction
} from './reducer';
import { IState } from '../../store';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchLabels, addLabel, updateLabel, deleteLabel, fetchItemsByLabels
} from '../../apis/labelApis';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(message.error, `Label Error Received: ${action.payload.error}`);
}

function* labelsUpdate(action: PayloadAction<UpdateLabels>) {
  try {
    //get etag from header
    const data = yield call(fetchLabels);
    const etag = data.headers.get('Etag')!;
    const labels = yield data.json();
    console.log(labels);

    yield put(labelActions.labelsReceived({ labels: labels, etag: etag }));
  } catch (error) {
    yield call(message.error, `Get Labels Error Received: ${error}`);
  }
}

function* createLabel(action: PayloadAction<LabelCreateAction>) {
  const { value, icon } = action.payload;
  try {
    const data = yield call(addLabel, value, icon);
    
    const state: IState = yield select();
    const labels = Object.assign([], state.label.labels);
    labels.unshift(data);
    yield put(labelActions.labelsReceived({ labels: labels, etag: '' }));
    yield call(message.info, `Label ${value} created`);
  } catch (error) {
    if (error.message === '400') {
      yield call(message.error, `Label "${action.payload.value}" already exists`);
    } else {
      yield call(message.error, `Label Create Fail: ${error}`);
    }
  }
}

function* patchLabel(action: PayloadAction<PatchLabelAction>) {
  try {
    const { labelId, value, icon } = action.payload;
    yield call(updateLabel, labelId, value, icon);
    yield put(labelActions.labelsUpdate({}));
  } catch (error) {
    yield call(message.error, `Patch label Fail: ${error}`);
  }
}

function* removeLabel(action: PayloadAction<DeleteLabelAction>) {
  try {
    const { labelId, value } = action.payload;
    yield call(deleteLabel, labelId);
    yield put(labelActions.labelsUpdate({}));
    yield call(message.success, `Label "${value}" deleted`);
  } catch (error) {
    yield call(message.error, `Delete label fail: ${error}`);
  }
}

function* getItemsByLabels(action: PayloadAction<GetItemsByLabelsAction>) {
  try {
    const { labels } = action.payload;
    const data = yield call(fetchItemsByLabels, labels);
    yield put(labelActions.itemsByLabelsReceived({items: data}));
  } catch (error) {
    yield call(message.error, `getItemsByLabels fail: ${error}`);
  }
}

export default function* labelSagas() {
  yield all([
    yield takeLatest(
      labelActions.labelsApiErrorReceived.type,
      apiErrorReceived
    ),
    yield takeLatest(labelActions.createLabel.type, createLabel),
    yield takeLatest(labelActions.deleteLabel.type, removeLabel),
    yield takeLatest(labelActions.labelsApiErrorReceived.type, apiErrorReceived),
    yield takeLatest(labelActions.patchLabel.type, patchLabel),
    yield takeLatest(labelActions.labelsUpdate.type, labelsUpdate),
    yield takeLatest(labelActions.getItemsByLabels.type, getItemsByLabels),
  ]);
}
