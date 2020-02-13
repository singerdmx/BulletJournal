import { DEV } from "../config";
import { doFetch } from "./api-helper";

export const fetchUserInfo = () => {
  return doFetch("/api/myself", "GET");
};

export const logoutUser = () => {
  return doFetch("/api/myself/logout", "POST");
};
