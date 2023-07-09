import { FetcherError } from "../fetcher";

interface CoreServerError {
  errorCode: string;
  message: {
    description: string;
  };
}

export function getCoreServerErrorMessageFromFetcherError(
  _error?: Error | null,
  fallback: string = "Something went wrong!"
): string | undefined {
  const error = _error as FetcherError<CoreServerError> | null;
  if (!error) return;
  const serverError = error?.data?.message?.description;
  const errorMessage = error.message;
  return (serverError ?? errorMessage) || fallback;
}

export function getCoreServerErrorCodeFromFetcherError(
  _error?: Error | null
): string | undefined {
  const error = _error as FetcherError<CoreServerError> | null;
  if (!error) return;
  const errorCode = error?.data?.errorCode;
  return errorCode;
}
