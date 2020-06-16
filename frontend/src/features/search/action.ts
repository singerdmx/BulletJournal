import {actions} from './reducer';

export const search = (term: string, scrollId?: string) => actions.search({term: term, scrollId: scrollId});
export const updateSearchPageNo = (searchPageNo: number) =>
    actions.updateSearchPageNo({searchPageNo: searchPageNo});