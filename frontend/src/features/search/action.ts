import {actions} from './reducer';

export const search = (term: string, scrollId?: string) => actions.search({term: term, scrollId: scrollId});
export const updateSearchTerm = (term: string) =>
    actions.updateSearchTerm({term: term});