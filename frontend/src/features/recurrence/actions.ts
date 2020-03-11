import { actions } from './reducer';

export const updateStartString = (startDate: string) =>
  actions.updateStart({
    startDate: startDate
  });

export const updateEndString = (
  mode: string,
  endDate: string,
  endCount: number
) =>
  actions.updateEnd({
    mode: mode,
    endDate: endDate,
    endCount: endCount
  });
