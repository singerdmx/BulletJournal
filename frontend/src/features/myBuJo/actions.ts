import { actions } from './reducer';

export const updateMyBuJoDates = (startDate: string, endDate: string) =>
  actions.datesReceived({
    startDate: startDate,
    endDate: endDate
  });
