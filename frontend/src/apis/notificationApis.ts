import { doFetch } from "./api-helper";

export const fetchNotifications = () => {
  return doFetch("/api/notifications", "GET")
    .then(res => res.json())
    .catch(err => {
      throw Error(err);
    });
};
