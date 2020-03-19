import { actions } from './reducer';

export const updateTimezone = (timezone: string) =>
  actions.updateTimezone({
    timezone: timezone
  });

export const updateBefore = (before: number) =>
  actions.updateBefore({
    before: before
  });

export const updateCurrency = (currency: string) =>
  actions.updateCurrency({
    currency: currency
  });

export const updateTheme = (theme: string) =>
    actions.updateTheme({ theme: theme});
