import { AxiosError } from "axios";

export type ErrorFactory = (error: AxiosError) => Error;
export type ErrorConstructor = new (message: string) => Error;

export type StatusErrorMap = Record<number, ErrorConstructor | ErrorFactory>;

// Default mapping for general cases
export const defaultStatusMap: StatusErrorMap = {
  401: AxiosError,
  403: AxiosError,
  404: AxiosError,
  500: AxiosError,
};

/**
 * Map AxiosError to a custom error using a StatusErrorMap.
 */
export function mapAxiosError(
  error: AxiosError,
  map: StatusErrorMap = {}
): Error {
  const status = error.response?.status || 0;
  const mapper = map[status];

  if (!mapper) {
    return new Error(error.message);
  }

  // If mapper is a function that is NOT a constructor
  if (typeof mapper === "function" && !(mapper.prototype instanceof Error)) {
    const factory = mapper as ErrorFactory;
    return factory(error);
  }

  // Otherwise it's a constructor
  const ErrorClass = mapper as ErrorConstructor;
  return new ErrorClass(error.message);
}
