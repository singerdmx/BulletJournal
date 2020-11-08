import {v4 as uuidv4} from 'uuid';
import {version} from "./versions";

export function doFetch(endpoint: string, etag: any = undefined) {
  if (process.env.REACT_APP_ENV === 'debug') {
    console.log(endpoint);
  }

  let headers = {} as any;

  if (etag) {
    headers = {headers: {'request-id': uuidv4(), 'If-None-Match': etag}}
  } else {
    headers = {headers: {'request-id': uuidv4()}}
  }
  return fetch(endpoint, headers).then(res => {
    if (!res.ok) {
      throw Error(res.status.toString());
    }
    const reload = res.headers.get('reload');
    if (reload && reload === 'true') {
      throw Error('reload');
    }
    const v = res.headers.get('version');
    if (v && v !== version) {
      console.log(`current version is ${version} and server version is ${v}`);
      localStorage.removeItem('reminders'); //TODO: remove
      throw Error('reload');
    }
    return res;
  });
}

export function doPost(endpoint: string, body?: string, etag?: string) {
  if (process.env.REACT_APP_ENV === 'debug') {
    console.log(endpoint);
  }

  let headers = {} as any;
  if (etag) {
    headers = {'Content-Type': 'application/json', 'request-id': uuidv4(), 'If-None-Match': etag};
  } else {
    headers = {'Content-Type': 'application/json', 'request-id': uuidv4()};
  }
  return fetch(endpoint, {
    headers: headers,
    method: 'POST',
    body: body
  }).then(res => {
    if (!res.ok) {
      throw Error(res.status.toString());
    }
    const reload = res.headers.get('reload');
    if (reload && reload === 'true') {
      throw Error('reload');
    }
    return res;
  });
}

export function doDelete(endpoint: string, returnError = false) {
  if (process.env.DEBUG_MODE === 'DEBUG') {
    console.log(endpoint);
  }
  return fetch(endpoint, {
    headers: {'request-id': uuidv4()},
    method: 'DELETE'
  }).then(res => {
    if (!res.ok && !returnError) {
      throw Error(res.status.toString());
    }
    const reload = res.headers.get('reload');
    if (reload && reload === 'true') {
      throw Error('reload');
    }
    return res;
  });
}

export function doPut(endpoint: string, body: string, etag?: string) {
  if (process.env.DEBUG_MODE === 'DEBUG') {
    console.log(endpoint);
  }

  let headers = {} as any;
  if (etag) {
    headers = {'Content-Type': 'application/json', 'request-id': uuidv4(), 'If-None-Match': etag};
  } else {
    headers = {'Content-Type': 'application/json', 'request-id': uuidv4()};
  }

  return fetch(endpoint, {
    headers: headers,
    method: 'PUT',
    body: body
  }).then(res => {
    if (!res.ok) {
      throw Error(res.status.toString());
    }
    const reload = res.headers.get('reload');
    if (reload && reload === 'true') {
      throw Error('reload');
    }
    return res;
  });
}

export function doPatch(endpoint: string, body: string, etag?: string) {
  if (process.env.DEBUG_MODE === 'DEBUG') {
    console.log(endpoint);
  }

  let headers = {} as any;
  if (etag) {
    headers = {'Content-Type': 'application/json', 'request-id': uuidv4(), 'If-None-Match': etag};
  } else {
    headers = {'Content-Type': 'application/json', 'request-id': uuidv4()};
  }

  return fetch(endpoint, {
    headers: headers,
    method: 'PATCH',
    body: body
  }).then(res => {
    if (!res.ok) {
      throw Error(res.status.toString());
    }
    const reload = res.headers.get('reload');
    if (reload && reload === 'true') {
      throw Error('reload');
    }
    return res;
  });
}
