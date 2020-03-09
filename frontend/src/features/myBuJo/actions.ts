import { actions } from './reducer';

export const updateMyBuJoDates = (startDate: string, endDate: string) =>
  actions.datesReceived({
    startDate: startDate,
    endDate: endDate
  });

export const updateSelectedCalendarDay = (selectedCalendarDay: string) =>
  actions.selectedCalendarDayReceived({
    selectedCalendarDay: selectedCalendarDay,
  });

export const getProjectItemsAfterUpdateSelect = (
  todoSelected: boolean,
  ledgerSelected: boolean,
  category: string
) =>
  actions.getProjectItemsAfterUpdateSelect({
    todoSelected: todoSelected,
    ledgerSelected: ledgerSelected,
    category: category
  });

export const getProjectItems = (
  startDate: string,
  endDate: string,
  timezone: string,
  category: string
) =>
  actions.getProjectItems({
    startDate: startDate,
    endDate: endDate,
    timezone: timezone,
    category: category
  });

export const calendarModeReceived = (
  calendarMode: string
) =>
  actions.calendarModeReceived({
    calendarMode: calendarMode,
  });
