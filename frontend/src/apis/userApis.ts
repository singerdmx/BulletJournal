import {doFetch, doPost} from './api-helper';

export const fetchUser = (username: string) => {
  return doFetch(`/api/users/${username}`)
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};

export const changeUserAlias = (targetUser: string, alias: string) => {
    const postBody = JSON.stringify({
        alias: alias
    });
    return doPost(`/api/users/${targetUser}/changeAlias`, postBody)
        .catch(err => {
            throw Error(err);
        });
};

export const sendInvitation = (emails: string[]) => {
    const postBody = JSON.stringify({
        emails: emails
    });
    return doPost('/api/appInvitations', postBody)
        .catch(err => {
            throw Error(err);
        });
}
