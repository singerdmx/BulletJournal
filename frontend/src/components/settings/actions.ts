import { actions } from './reducer';

export const updateTimezoneSaveButtonVisiblility = (
  timezoneSaveButtonVisible: boolean
) =>
  actions.updateTimezoneSaveButtonVisiblility({
    timezoneSaveButtonVisible: timezoneSaveButtonVisible
  });

export const updateBeforeSaveButtonVisiblility = (
  beforeSaveButtonVisible: boolean
) =>
  actions.updateBeforeSaveButtonVisiblility({
    beforeSaveButtonVisible: beforeSaveButtonVisible
  });
