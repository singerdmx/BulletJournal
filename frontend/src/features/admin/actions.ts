import { actions } from './reducer';
import { Role } from './interface';

export const setRole = (username: string, role: Role) =>
  actions.setRole({ username: username, role: role });
