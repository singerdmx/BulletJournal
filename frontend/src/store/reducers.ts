import { reducer as userReducer } from '../features/user-info/reducer';
import { reducer as notificationReducer } from '../features/notification/reducer';
import { reducer as groupReducer } from '../features/group/reducer';

export default {
  user: userReducer,
  notice: notificationReducer,
  group: groupReducer
};
