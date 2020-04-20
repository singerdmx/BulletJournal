import {all, call, put, select, takeLatest} from 'redux-saga/effects';
import {message, notification} from 'antd';
import {actions as systemActions, GetPublicProjectItem, SystemApiErrorAction, UpdateSystem} from './reducer';
import {PayloadAction} from 'redux-starter-kit';
import {fetchSystemUpdates, getPublicProjectItem} from '../../apis/systemApis';
import {ContentType} from "../myBuJo/constants";
import {getProject, updateProjects} from '../project/actions';
import {updateGroups} from '../group/actions';
import {updateNotifications} from '../notification/actions';
import {ProjectType} from "../project/constants";
import {Task} from '../tasks/interface';

const fetchReminderFromLocal = () => {
    const defaultReminders = [] as Task[];
    const reminders = localStorage.getItem('reminders') || '';
    if (!reminders) {
        localStorage.setItem('reminders', JSON.stringify(defaultReminders));
        return defaultReminders;
    }
    return JSON.parse(reminders);
};

const taskNameMapper = (item: any) => item.name;

const saveTasksIntoLocal = (tasks: Task[]) => {
    localStorage.clear();
    localStorage.setItem('reminders', JSON.stringify(tasks));
};

function* systemApiErrorAction(action: PayloadAction<SystemApiErrorAction>) {
    yield call(message.error, `System Error Received: ${action.payload.error}`);
}

function* SystemUpdate(action: PayloadAction<UpdateSystem>) {
    try {
        const state = yield select();
        const selectedProject = state.project.project;

        const data = yield call(fetchSystemUpdates, '',
            selectedProject && selectedProject.projectType !== ProjectType.LEDGER ? selectedProject.id : undefined);

        const {groupsEtag, notificationsEtag, ownedProjectsEtag, sharedProjectsEtag, remindingTaskEtag} = state.system;
        if (ownedProjectsEtag !== data.ownedProjectsEtag || sharedProjectsEtag !== data.sharedProjectsEtag) {
            yield put(updateProjects());
        }

        if (groupsEtag !== data.groupsEtag) {
            yield put(updateGroups());
        }

        if (notificationsEtag !== data.notificationsEtag) {
            yield put(updateNotifications());
        }

        let newComingTasks = [] as Task[];
        var now = new Date().getTime();
        let localReminders = fetchReminderFromLocal();
        let unExpiredLocalReminders = localReminders.filter((reminder: any)=>{
            return now - reminder.time < 2 * 60 * 60 * 1000;
        })
        if(remindingTaskEtag !== data.remindingTaskEtag){
            newComingTasks = data.reminders.map(taskNameMapper).filter((task: any)=>!localReminders.map(taskNameMapper).includes(task)).map((item: any)=>({
                name: item,
                time: now
            }));
            yield all(
                [...newComingTasks.map(item => {
                    const args = {
                        message: item.name,
                        description: 'task due time',
                        duration: 30
                    };
                    return call(notification.open, args)
                })]
            );
            saveTasksIntoLocal([...newComingTasks, ...unExpiredLocalReminders]);
        }

        let tasksEtag = state.system.tasksEtag;
        let notesEtag = state.system.notesEtag;

        switch (selectedProject.projectType) {
            case ProjectType.TODO:
                if (data.tasksEtag !== tasksEtag) {
                    tasksEtag = data.tasksEtag;
                    yield put(getProject(selectedProject.id))
                }
                break;
            case ProjectType.NOTE:
                if (data.notesEtag !== notesEtag) {
                    notesEtag = data.notesEtag;
                    yield put(getProject(selectedProject.id))
                }
                break;
            default:
        }

        if (notificationsEtag !== data.notificationsEtag) {
            yield call(message.info, "You've got new notifications");
        }

        yield put(
            systemActions.systemUpdateReceived({
                tasksEtag: tasksEtag,
                notesEtag: notesEtag,
                groupsEtag: data.groupsEtag,
                notificationsEtag: data.notificationsEtag,
                ownedProjectsEtag: data.ownedProjectsEtag,
                sharedProjectsEtag: data.sharedProjectsEtag,
                remindingTaskEtag: data.remindingTaskEtag,
                reminders: data.reminders
            })
        );
    } catch (error) {
        yield call(message.error, `System Error Received: ${error}`);
    }
}

function* getPublicItem(action: PayloadAction<GetPublicProjectItem>) {
    try {
        const {itemId} = action.payload;
        const data = yield call(getPublicProjectItem, itemId);
        const type: ContentType = data.contentType;
        const note = type === ContentType.NOTE ? data.projectItem : undefined;
        const task = type === ContentType.TASK ? data.projectItem : undefined;
        yield put(systemActions.publicProjectItemReceived({
            contentType: type, contents: data.contents,
            publicNote: note, publicTask: task
        }));
    } catch (error) {
        yield call(message.error, `getPublicItem Received: ${error}`);
    }
}

export default function* systemSagas() {
    yield all([
        yield takeLatest(
            systemActions.systemApiErrorReceived.type,
            systemApiErrorAction
        ),
        yield takeLatest(systemActions.systemUpdate.type, SystemUpdate),
        yield takeLatest(systemActions.fetchPublicProjectItem.type, getPublicItem)
    ]);
}
