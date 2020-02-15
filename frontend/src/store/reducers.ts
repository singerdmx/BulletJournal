import { reducer as userReducer } from '../features/user-info/reducer';
<<<<<<< HEAD
import { reducer as notificationReducer } from '../features/notification/reducer'


export default {
  user: userReducer,
  notifications: notificationReducer
=======
import { reducer as notificationReducer } from '../features/notification/reducer';
import { reducer as groupReducer } from '../features/group/reducer';

export default {
  user: userReducer,
  notice: notificationReducer,
  group: groupReducer
>>>>>>> b05240c24c7a064ce4abe882d9fcdd1d45f0b892
};
