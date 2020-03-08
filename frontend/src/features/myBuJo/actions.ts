import { actions } from './reducer';
import { ProjectType } from '../project/constants';

export const updateMyBuJoDates = (startDate: string, endDate: string) =>
  actions.datesReceived({
    startDate: startDate,
    endDate: endDate
  });

export const getProjectItemsAfterUpdateSelect = (
  todoSelected: boolean,
  ledgerSelected: boolean,
  startDate: string,
  endDate: string,
  timezone: string
) =>
  actions.getProjectItemsAfterUpdateSelect({
    todoSelected: todoSelected,
    ledgerSelected: ledgerSelected,
    startDate: startDate,
    endDate: endDate,
    timezone: timezone
  });

export const getProjectItems = (
  types: ProjectType[],
  startDate: string,
  endDate: string,
  timezone: string
) =>
  actions.getProjectItems({
    types: types,
    startDate: startDate,
    endDate: endDate,
    timezone: timezone
  });
