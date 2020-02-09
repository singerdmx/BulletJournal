import { DEV } from '../config';
import { doFetch } from './api-helper';

export const fetchUserInfo = ()=>{
    const endpoint = DEV.baseapi;
    return doFetch(endpoint);
}