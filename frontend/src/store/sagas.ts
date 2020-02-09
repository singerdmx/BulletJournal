import { spawn } from 'redux-saga/effects';
import userSaga from '../features/user-info/saga';


export default function* root() {
  yield spawn(userSaga);
}