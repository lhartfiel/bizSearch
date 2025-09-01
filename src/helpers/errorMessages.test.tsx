import { getErrorFriendlyMessage, errorMessages } from "./errorMessages";

const codes = Object.entries(errorMessages) as [number, string][];

describe("errorMessages helper", () => {
  codes.forEach(([status, message]) => {
    it(`should return correct message for ${status}`, () => {
      expect(getErrorFriendlyMessage(status)).toBe(message);
    });
  });

  it("should return default message for unknown status codes", () => {
    expect(getErrorFriendlyMessage(999)).toBeUndefined();
  });
});
