export const errorMessages: Record<number, string> = {
  400: "Invalid request. Please check your input and try again.",
  401: "Unauthorized. Please log in to continue.",
  403: "Access denied. You don't have permission.",
  404: "No results found for your search.",
  429: "Too many requests. Please wait and try again.",
  500: "Server error. Please try again later.",
};

export const getErrorFriendlyMessage = (status: number) => {
  return errorMessages[status];
};
