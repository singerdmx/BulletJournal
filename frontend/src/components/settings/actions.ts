import { actions } from './reducer';

export const updateTimezone = (timezone: string) =>
  actions.updateTimezone({
    timezone: timezone
  });

export const updateBefore = (before: number) =>
  actions.updateBefore({
    before: before
  });
