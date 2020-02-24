import { actions } from './reducer';
import { Before } from './reducer';

export const updateMyself = () => actions.myselfUpdate({});
export const updateExpandedMyself = () => actions.expandedMyselfUpdate({});
export const updateTimezone = (timezone: string) =>
  actions.myselfDataReceived({
    timezone: timezone
  });
export const updateBefore = (before: Before) =>
  actions.myselfDataReceived({
    before: before
  });
export const patchMyself = () => actions.patchMyself({});
