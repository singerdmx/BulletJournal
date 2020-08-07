import { actions } from './reducer';

export const updateMyself = () => actions.myselfUpdate({});

export const clearMyself = () => actions.clearMyself({});

export const updateTheme = () => actions.themeUpdate({});

export const expandedMyselfLoading = (loading: boolean) =>
  actions.expandedMyselfLoading({loading: loading});

export const updateExpandedMyself = (updateSettings: boolean) =>
  actions.expandedMyselfUpdate({ updateSettings: updateSettings });

export const updateTimezone = (timezone: string) =>
  actions.myselfDataReceived({
    timezone: timezone
  });
export const updateBefore = (before: number) =>
  actions.myselfDataReceived({
    before: before
  });
export const patchMyself = (
  timezone?: string,
  before?: number,
  currency?: string,
  theme?: string,
) => actions.patchMyself({ timezone, before, currency, theme });

export const getUserPointActivities = () => actions.getUserPointActivities({});
