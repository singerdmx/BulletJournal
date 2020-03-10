import { actions } from './reducer';

export const updateStartString = (startDate: string) =>
  actions.updateStart({
    startDate: startDate
  });
