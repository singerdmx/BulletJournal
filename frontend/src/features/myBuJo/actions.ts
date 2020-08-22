import { actions } from './reducer';

export const updateMyBuJoDates = (startDate: string, endDate: string) =>
  actions.updateMyBuJoDates({
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
  noteSelected: boolean,
  category: string,
  forceToday?: boolean
) =>
  actions.getProjectItemsAfterUpdateSelect({
    todoSelected: todoSelected,
    ledgerSelected: ledgerSelected,
    noteSelected: noteSelected,
    category: category,
    forceToday: forceToday
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
