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

export function doPost(endpoint: string) {
    if (process.env.DEBUG_MODE === "DEBUG") {
      console.log(endpoint);
    }
    return fetch(endpoint, {
      headers: {},
      method: 'POST'
    }).then(res => {
      if (!res.ok) {
        throw Error(res.statusText);
      } else {
        return res;
      }
    });
}
