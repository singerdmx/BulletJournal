import { DEV } from '../config';
import { doFetch } from './api-helper';

export const fetchUserInfo = ()=>{
    return doFetch('/api/myself');
}