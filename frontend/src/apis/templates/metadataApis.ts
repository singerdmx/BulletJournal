import {doFetch} from '../api-helper';

export const fetchChoiceMetadata = () => {
    return doFetch('/api/choiceMetadata')
        .then((res) => res.json())
        .catch((err) => {
            throw Error(err.message);
        });
}