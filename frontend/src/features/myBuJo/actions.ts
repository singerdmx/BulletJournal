import { actions } from './reducer';
import {ProjectType} from "../project/constants";

export const updateMyBuJoDates = (startDate: string, endDate: string) =>
  actions.datesReceived({
    startDate: startDate,
    endDate: endDate
  });

export const getProjectItems = (types: ProjectType[], startDate: string, endDate: string, timezone: string) =>
    actions.getProjectItems({types: types, startDate: startDate, endDate: endDate, timezone: timezone});
