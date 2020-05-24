import {actions} from './reducer';
import {ProjectItem} from "../myBuJo/interface";

export const recentItemsReceived = (items: ProjectItem[]) => actions.recentItemsReceived({items: items});
export const updateRecentItemsDates = (startDate: string, endDate: string) =>
    actions.updateRecentDates({
        startDate: startDate,
        endDate: endDate
    });