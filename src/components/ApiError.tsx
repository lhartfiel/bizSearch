import { getErrorFriendlyMessage } from "../helpers/errorMessages";
class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super();
    this.message = getErrorFriendlyMessage(status);
    this.status = status;
    this.name = "ApiError";
  }
}

export { ApiError };
