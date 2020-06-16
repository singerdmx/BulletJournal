import {ContentType} from "../myBuJo/constants";

export const searchResultPageSize = 50;

export interface SearchResultItem {
    id: number,
    type: ContentType,
    name: string,
    nameHighlights: string[],
    contentHighlights: string[],
}

export interface SearchResult {
    scrollId: string,
    totalHits: number,
    searchResultItemList: SearchResultItem[]
}