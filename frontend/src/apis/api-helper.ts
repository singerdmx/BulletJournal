export function doFetch(endpoint: string) {
  if (process.env.DEBUG_MODE === "DEBUG") {
    console.log(endpoint);
  }
  return fetch(endpoint, {
    headers: {},
  }).then(res => {
    if (!res.ok) {
      throw Error(res.statusText);
    } else {
      return res;
    }
  });
}

export function doPost(endpoint: string, body: string) {
    if (process.env.DEBUG_MODE === "DEBUG") {
      console.log(endpoint);
    }
    return fetch(endpoint, {
      headers: { 'Content-Type': 'application/json'},
      method: 'POST',
      body: body
    }).then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      } else {
        return res;
      }
    });
}

export function doDelete(endpoint: string) {
  if (process.env.DEBUG_MODE === "DEBUG") {
    console.log(endpoint);
  }
  return fetch(endpoint, {
    method: 'DELETE'
  }).then(res => {
    if (!res.ok) {
      throw Error(res.statusText);
    }
    return res;
  });
}