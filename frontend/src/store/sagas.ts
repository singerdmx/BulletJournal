import { spawn } from 'redux-saga/effects';
import userSaga from '../features/saga';


export default function* root() {
  yield spawn(userSaga);
}