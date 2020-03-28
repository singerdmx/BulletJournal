import { v4 as uuidv4 } from 'uuid';

export function doFetch(endpoint: string) {
  if (process.env.REACT_APP_ENV === 'debug') {
    console.log(endpoint);
  }
  return fetch(endpoint, {
    headers: { 'request-id': uuidv4() }
  }).then(res => {
    if (!res.ok) {
      throw Error(res.status.toString());
    }
    return res;
  });
}

export function doPost(endpoint: string, body?: string) {
  if (process.env.REACT_APP_ENV === 'debug') {
    console.log(endpoint);
  }
  return fetch(endpoint, {
    headers: { 'Content-Type': 'application/json', 'request-id': uuidv4() },
    method: 'POST',
    body: body
  }).then(res => {
    if (!res.ok) {
      throw Error(res.status.toString());
    }
    return res;
  });
}

export function doDelete(endpoint: string, returnError = false) {
  if (process.env.DEBUG_MODE === 'DEBUG') {
    console.log(endpoint);
  }
  return fetch(endpoint, {
    headers: { 'request-id': uuidv4() },
    method: 'DELETE'
  }).then(res => {
    if (!res.ok && !returnError) {
      throw Error(res.status.toString());
    }
    return res;
  });
}

export function doPut(endpoint: string, body: string) {
  if (process.env.DEBUG_MODE === 'DEBUG') {
    console.log(endpoint);
  }
  return fetch(endpoint, {
    headers: { 'Content-Type': 'application/json', 'request-id': uuidv4() },
    method: 'PUT',
    body: body
  }).then(res => {
    if (!res.ok) {
      throw Error(res.status.toString());
    }
    return res;
  });
}

export function doPatch(endpoint: string, body: string) {
  if (process.env.DEBUG_MODE === 'DEBUG') {
    console.log(endpoint);
  }
  return fetch(endpoint, {
    headers: { 'Content-Type': 'application/json', 'request-id': uuidv4() },
    method: 'PATCH',
    body: body
  }).then(res => {
    if (!res.ok) {
      throw Error(res.status.toString());
    }
    return res;
  });
}
