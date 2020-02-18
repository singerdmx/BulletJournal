import { reducer as myselfReducer } from '../features/user-info/reducer';
import { reducer as notificationReducer } from '../features/notification/reducer';
import { reducer as groupReducer } from '../features/group/reducer';
import { reducer as projectReducer } from '../features/project/reducer';
import { reducer as systemReducer } from '../features/system/reducer';

export default {
  myself: myselfReducer,
  notice: notificationReducer,
  group: groupReducer,
  project: projectReducer,
  system: systemReducer
};
