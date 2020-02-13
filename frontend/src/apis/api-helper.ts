export function doFetch(endpoint: string, httpMethod: string) {
  if (process.env.DEBUG_MODE === "DEBUG") {
    console.log(endpoint);
  }
  return fetch(endpoint, {
    headers: {},
    method: httpMethod
  }).then(res => {
    if (!res.ok) {
      throw Error(res.statusText);
    } else {
      return res;
    }
  });
}
