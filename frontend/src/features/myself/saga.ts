import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message} from 'antd';
import {
    actions as myselfActions,
    ClearMyself,
    DeleteSampleTaskAction,
    DeleteSampleTasksAction,
    FetchUserPointActivities,
    GetSubscribedCategories,
    MySampleTasksAction,
    MyselfApiErrorAction,
    PatchMyself,
    ThemeUpdate,
    UnsubscribedCategory,
    UpdateCategorySubscription,
    UpdateExpandedMyself,
    UpdateMyself
} from './reducer';
import {IState} from '../../store';
import {actions as settingsActions} from '../../components/settings/reducer';
import {getProjectItems, updateMyBuJoDates, updateSelectedCalendarDay,} from '../../features/myBuJo/actions';
import {PayloadAction} from 'redux-starter-kit';
import {clearMyself, fetchMyself, getUserPointActivities, patchMyself} from '../../apis/myselfApis';
import moment from 'moment';
import {dateFormat} from '../myBuJo/constants';
import {expandedMyselfLoading, reloadReceived} from './actions';
import {UserPointActivity} from "../../pages/points/interface";
import {
    fetchUserSampleTasks,
    getUserSubscribedCategories,
    removeUserSampleTask,
    removeUserSampleTasks
} from "../../apis/templates/workflowApis";
import {SubscribedCategory} from "./interface";
import {removeUserCategory, updateSubscription} from "../../apis/templates/categoryApis";
import {SampleTask} from "../templates/interface";

function* myselfApiErrorAction(action: PayloadAction<MyselfApiErrorAction>) {
    yield call(message.error, `Myself Error Received: ${action.payload.error}`);
}

function* getExpandedMyself(action: PayloadAction<UpdateExpandedMyself>) {
    try {
        const {updateSettings} = action.payload;

        const data = yield call(fetchMyself, true);

        let currentTime = new Date().toLocaleString('fr-CA', {
            timeZone: data.timezone,
        });
        currentTime = currentTime.substring(0, 10);

        yield put(
            myselfActions.myselfDataReceived({
                username: data.name,
                avatar: data.avatar,
                timezone: data.timezone,
                before: data.reminderBeforeTask,
                currency: data.currency,
                theme: data.theme,
                points: data.points,
                firstTime: data.firstTime,
                sendUserInvitation: data.sendUserInvitation
            })
        );
        const state: IState = yield select();

        if (state.myBuJo.startDate) return;

        yield put(updateMyBuJoDates(currentTime, currentTime));

        yield put(updateSelectedCalendarDay(currentTime));
        yield put(
            getProjectItems(
                moment(new Date()).add(-60, 'days').format(dateFormat),
                moment(new Date()).add(60, 'days').format(dateFormat),
                data.timezone,
                'calendar'
            )
        );

        if (updateSettings) {
            yield put(settingsActions.updateTimezone({timezone: data.timezone}));
            yield put(
                settingsActions.updateBefore({before: data.reminderBeforeTask})
            );
            yield put(settingsActions.updateCurrency({currency: data.currency}));
            yield put(settingsActions.updateTheme({theme: data.theme}));
        }
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `Myself (Expand) Error Received: ${error}`);
        }
    }
}

function* updateTheme(action: PayloadAction<ThemeUpdate>) {
    try {
        yield put(expandedMyselfLoading(true));
        const data = yield call(fetchMyself, true);
        yield put(
            myselfActions.myselfDataReceived({
                username: data.name,
                avatar: data.avatar,
                timezone: data.timezone,
                before: data.reminderBeforeTask,
                currency: data.currency,
                theme: data.theme,
                firstTime: data.firstTime,
            })
        );
        yield put(expandedMyselfLoading(false));
    } catch (error) {
        yield put(expandedMyselfLoading(false));
        yield call(message.error, `Update Theme  Error Received: ${error}`);
    }
}

function* myselfUpdate(action: PayloadAction<UpdateMyself>) {
    try {
        const data = yield call(fetchMyself);

        yield put(
            myselfActions.myselfDataReceived({
                username: data.name,
                avatar: data.avatar,
            })
        );
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `Myself Error Received: ${error}`);
        }
    }
}

function* myselfPatch(action: PayloadAction<PatchMyself>) {
    try {
        const {timezone, before, currency, theme} = action.payload;
        yield call(patchMyself, timezone, before, currency, theme);
        let currentTime = new Date().toLocaleString('fr-CA', {
            timeZone: timezone,
        });
        if (currentTime) currentTime = currentTime.substring(0, 10);
        yield put(
            myselfActions.myselfDataReceived({
                timezone: timezone,
                before: before,
                currency: currency,
                theme: theme,
            })
        );
        yield put(updateMyBuJoDates(currentTime, currentTime));
        yield call(message.success, 'User Settings updated successfully');
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `Myself Patch Error Received: ${error}`);
        }
    }
}

function* unsetMyself(action: PayloadAction<ClearMyself>) {
    try {
        yield call(clearMyself);
        yield put(myselfActions.myselfDataReceived({firstTime: false}));
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `unsetMyself Error Received: ${error}`);
        }
    }
}

function* fetchUserPointActivities(action: PayloadAction<FetchUserPointActivities>) {
    try {
        const data: UserPointActivity[] = yield call(getUserPointActivities);
        yield put(
            myselfActions.userPointActivitiesReceived({
                userPointActivities: data
            })
        );
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `fetchUserPointActivities Error Received: ${error}`);
        }
    }
}

function* getSubscribedCategories(action: PayloadAction<GetSubscribedCategories>) {
    try {
        const data: SubscribedCategory[] = yield call(getUserSubscribedCategories);
        yield put(
            myselfActions.subscribedCategoriesReceived({
                subscribedCategories: data
            })
        );
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `getSubscribedCategories Error Received: ${error}`);
        }
    }
}

function* unsubscribedCategory(action: PayloadAction<UnsubscribedCategory>) {
    try {
        const {categoryId, selectionId} = action.payload;
        const data: SubscribedCategory[] = yield call(removeUserCategory, categoryId, selectionId);
        yield put(
            myselfActions.subscribedCategoriesReceived({
                subscribedCategories: data
            })
        );
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `unsubscribedCategory Error Received: ${error}`);
        }
    }
}

function* updateCategorySubscription(action: PayloadAction<UpdateCategorySubscription>) {
    try {
        const {categoryId, selectionId, projectId} = action.payload;
        const data: SubscribedCategory[] = yield call(updateSubscription, categoryId, selectionId, projectId);
        yield put(
            myselfActions.subscribedCategoriesReceived({
                subscribedCategories: data
            })
        );
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `updateCategorySubscription Error Received: ${error}`);
        }
    }
}

function* getMySampleTasks(action: PayloadAction<MySampleTasksAction>) {
    try {
        const data: SampleTask[] = yield call(fetchUserSampleTasks);
        yield put(
            myselfActions.sampleTasksReceived({
                sampleTasks: data
            })
        );
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `getMySampleTasks Error Received: ${error}`);
        }
    }
}

function* deleteMySampleTask(action: PayloadAction<DeleteSampleTaskAction>) {
    try {
        const {id} = action.payload;
        const data: SampleTask[] = yield call(removeUserSampleTask, id);
        yield put(
            myselfActions.sampleTasksReceived({
                sampleTasks: data
            })
        );
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `deleteMySampleTask Error Received: ${error}`);
        }
    }
}

function* deleteMySampleTasks(action: PayloadAction<DeleteSampleTasksAction>) {
    try {
        yield put(myselfActions.removingSampleTasksReceived({deleting: true}));

        const {sampleTasks, assignees, labels, projectId, reminderBefore, startDate, timezone} = action.payload;
        const data: SampleTask[] = yield call(removeUserSampleTasks, sampleTasks, projectId, assignees,
            reminderBefore, labels, startDate, timezone);
        yield put(
            myselfActions.sampleTasksReceived({
                sampleTasks: data
            })
        );
    } catch (error) {
        if (error.message === 'reload') {
            yield put(reloadReceived(true));
        } else {
            yield call(message.error, `deleteMySampleTasks Error Received: ${error}`);
        }
    }
    yield put(myselfActions.removingSampleTasksReceived({deleting: false}));
}

export default function* myselfSagas() {
    yield all([
        yield takeLatest(
            myselfActions.myselfApiErrorReceived.type,
            myselfApiErrorAction
        ),
        yield takeLatest(myselfActions.myselfUpdate.type, myselfUpdate),
        yield takeLatest(myselfActions.patchMyself.type, myselfPatch),
        yield takeLatest(myselfActions.clearMyself.type, unsetMyself),
        yield takeLatest(
            myselfActions.expandedMyselfUpdate.type,
            getExpandedMyself
        ),
        yield takeLatest(myselfActions.themeUpdate.type, updateTheme),
        yield takeLatest(myselfActions.getUserPointActivities.type, fetchUserPointActivities),
        yield takeLatest(myselfActions.getSubscribedCategories.type, getSubscribedCategories),
        yield takeLatest(myselfActions.unsubscribedCategory.type, unsubscribedCategory),
        yield takeLatest(myselfActions.updateCategorySubscription.type, updateCategorySubscription),
        yield takeLatest(myselfActions.getMySampleTasks.type, getMySampleTasks),
        yield takeLatest(myselfActions.deleteMySampleTask.type, deleteMySampleTask),
        yield takeLatest(myselfActions.deleteMySampleTasks.type, deleteMySampleTasks),
    ]);
}

