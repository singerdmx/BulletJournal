import { takeLatest, call, all, put } from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as labelActions,
  ApiErrorAction,
  LabelCreateAction,
  DeleteLabelAction,
  PatchLabelAction,
  UpdateLabels,
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {
  fetchLabels, addLabel, updateLabel, deleteLabel,
} from '../../apis/labelApis';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(message.error, `Group Error Received: ${action.payload.error}`);
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
  const name = action.payload.name;
  try {
    console.log('createLabel');
    const data = yield call(addLabel, name);
    yield call(message.info, `Label ${name} created`);
  } catch (error) {
    if (error.message === '400') {
      yield call(message.error, `Label with ${name} already exists`);
    } else {
      yield call(message.error, `Label Create Fail: ${error}`);
    }
  }
}

function* patchLabel(action: PayloadAction<PatchLabelAction>) {
  try {
    const { labelId, name } = action.payload;
    const label = yield call(updateLabel, labelId, name);
  } catch (error) {
    yield call(message.error, `Patch label Fail: ${error}`);
  }
}

function* removeLabel(action: PayloadAction<DeleteLabelAction>) {
  try {
    const { labelId, name } = action.payload;
    yield call(deleteLabel, labelId);
    yield call(message.success, `Label "${name}" deleted`);
  } catch (error) {
    yield call(message.error, `Delete label fail: ${error}`);
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
  ]);
}
