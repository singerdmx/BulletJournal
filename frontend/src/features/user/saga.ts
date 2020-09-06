import {takeLatest, call, all, put, select} from 'redux-saga/effects';
import { message } from 'antd';
import {
  actions as userActions,
  UserApiErrorAction,
  UpdateUser, ChangeAlias
} from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import {changeUserAlias, fetchUser} from '../../apis/userApis';
import {actions as groupsActions} from "../group/reducer";
import {actions as systemsActions} from "../system/reducer";
import {IState} from "../../store";
import {GroupsWithOwner} from "../group/interface";
import {reloadReceived} from "../myself/actions";

function* userApiErrorAction(action: PayloadAction<UserApiErrorAction>) {
  yield call(message.error, `${action.payload.error}`);
}

function* userUpdate(action: PayloadAction<UpdateUser>) {
  const { name } = action.payload;
  try {
    const data = yield call(fetchUser, name);
    yield put(
      userActions.userDataReceived({
        name: data.name,
        avatar: data.avatar,
        id: data.id,
        thumbnail: data.thumbnail
      })
    );
  } catch (error) {
    yield put(userActions.userClear({}));
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `User ${name} Not Found`);
    }
  }
}

function* changeAlias(action: PayloadAction<ChangeAlias>) {
  const { targetUser, alias, groupId, history } = action.payload;
  try {
    yield call(changeUserAlias, targetUser, alias);

    const state: IState = yield select();
    const groups : GroupsWithOwner[] = JSON.parse(JSON.stringify(state.group.groups));
    let targetGroup = undefined;
    groups.forEach(g => {
      g.groups.forEach(group => {
        group.users.forEach(u => {
          if (u.name === targetUser) {
            u.alias = alias;
          }
        });
        if (group.id === groupId) {
          targetGroup = group;
        }
      })
    });

    yield put(groupsActions.groupsReceived({groups: groups}));
    yield put(groupsActions.groupReceived({group: targetGroup}));

    yield call(message.success, `User ${targetUser} is aliased to ${alias}. It may take some time to take effect.`);
    yield put(systemsActions.systemUpdate({force: true, history: history}));
  } catch (error) {
    if (error.message === 'reload') {
      yield put(reloadReceived(true));
    } else {
      yield call(message.error, `changeAlias Fail: ${error}`);
    }
  }
}

export default function* userSagas() {
  yield all([
    yield takeLatest(userActions.userApiErrorReceived.type, userApiErrorAction),
    yield takeLatest(userActions.userUpdate.type, userUpdate),
    yield takeLatest(userActions.userAliasUpdate.type, changeAlias)
  ]);
}
