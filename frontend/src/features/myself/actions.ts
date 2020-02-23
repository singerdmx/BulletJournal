import { actions } from './reducer';

export const updateMyself = () => actions.myselfUpdate({});
export const updateExpandedMyself = () => actions.expandedMyselfUpdate({});
export const updateTimezone = (timezone: string) =>
  actions.myselfDataReceived({
    timezone: timezone,
    username: '',
    avatar: ''
  });
