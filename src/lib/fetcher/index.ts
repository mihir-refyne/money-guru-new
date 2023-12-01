interface FetcherOption {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Record<string, string>;
  payload?: Record<string, unknown>;
  headers?: Record<string, string>;
}

export class FetcherError<T = unknown> extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public data: T
  ) {
    super(message);
  }
}

export async function fetcher<T extends unknown>(
  url: string,
  options: FetcherOption = {}
): Promise<{ statusCode: number; headers: Record<string, unknown>; data: T }> {
  const { method = "GET", payload, headers = {}, query } = options;
  const urlSearchParams = new URLSearchParams(query).toString();
  const urlWithSearchParams =
    urlSearchParams.length > 0 ? `${url}?${urlSearchParams}` : url;
  const res = await fetch(urlWithSearchParams, {
    method,
    headers: Object.assign({}, headers, {
      "Content-Type": "application/json",
      "x-client-type": "WEBAPP",
    }),
    body: payload ? JSON.stringify(payload) : undefined,
  });
  const respInJson = await res
    .json()
    .then((resp) => {
      if (resp === null) throw new Error("response is null");
      return resp;
    })
    .catch((_) => ({}));
  if (!res.ok) {
    throw new FetcherError(res.status, res.statusText, respInJson);
  }
  return {
    statusCode: res.status,
    data: respInJson,
    headers: Object.fromEntries(res.headers.entries()),
  };
}
