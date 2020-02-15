import { reducer as userReducer } from '../features/user-info/reducer';
import { reducer as notificationReducer } from '../features/notification/reducer';

export default {
  user: userReducer,
  notice: notificationReducer
};
