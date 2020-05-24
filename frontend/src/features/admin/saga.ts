import { all, call, put, select, takeLatest } from 'redux-saga/effects';
import { message } from 'antd';
import { PayloadAction } from 'redux-starter-kit';
import { IState } from '../../store';
import { actions as adminActions, setRoleAction } from './reducer';
import { setRole } from '../../apis/adminApis';

function* setUserRole(action: PayloadAction<setRoleAction>) {
  try {
    const { username, role } = action.payload;
    yield call(setRole, username, role);
    yield call(message.success, 'set Admin successfully');
  } catch (error) {
    yield call(message.error, `setRole Error Received: ${error}`);
  }
}

export default function* AdminSagas() {
  yield all([yield takeLatest(adminActions.setRole.type, setUserRole)]);
}
