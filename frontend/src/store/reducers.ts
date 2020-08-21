import { reducer as myselfReducer } from '../features/myself/reducer';
import { reducer as notificationReducer } from '../features/notification/reducer';
import { reducer as groupReducer } from '../features/group/reducer';
import { reducer as projectReducer } from '../features/project/reducer';
import { reducer as systemReducer } from '../features/system/reducer';
import { reducer as userReducer } from '../features/user/reducer';
import { reducer as settingsReducer } from '../components/settings/reducer';
import { reducer as noteReducer } from '../features/notes/reducer';
import { reducer as labelReducer } from '../features/label/reducer';
import { reducer as myBuJoReducer } from '../features/myBuJo/reducer';
import { reducer as rRuleReducer } from '../features/recurrence/reducer';
import { reducer as transactionReducer } from '../features/transactions/reducer';
import { reducer as taskReducer } from '../features/tasks/reducer';
import { reducer as calendarSyncReducer } from '../features/calendarSync/reducer';
import { reducer as recent } from '../features/recent/reducer';
import { reducer as admin } from '../features/admin/reducer';
import { reducer as search } from '../features/search/reducer';
import { reducer as content } from '../features/content/reducer';
import { reducer as templates } from '../features/templates/reducer';

export default {
  settings: settingsReducer,
  myself: myselfReducer,
  notice: notificationReducer,
  group: groupReducer,
  project: projectReducer,
  system: systemReducer,
  user: userReducer,
  note: noteReducer,
  label: labelReducer,
  myBuJo: myBuJoReducer,
  rRule: rRuleReducer,
  transaction: transactionReducer,
  task: taskReducer,
  calendarSync: calendarSyncReducer,
  recent: recent,
  admin: admin,
  search: search,
  content: content,
  templates: templates,
};
