import { getErrorFriendlyMessage, errorMessages } from "./errorMessages";
import { describe, it, expect } from "vitest";
import { dedupResponses, cleanedPhoneNum } from "./helperFns";

const responseInput = [
  {
    address: "123 Main St",
    phone: "1234567890",
    name: "Business A",
  },
  {
    address: "123 Maine St",
    phone: "1234567890",
    name: "Business A",
  },
  {
    address: "11223 Oak St",
    phone: "3216549870",
    name: "Business B",
  },
];
describe("dedupResponses", () => {
  it("should remove duplicate entries based on phone number", () => {
    const expectedOutput = [
      {
        address: "123 Main St",
        phone: "1234567890",
        name: "Business A",
      },
      {
        address: "11223 Oak St",
        phone: "3216549870",
        name: "Business B",
      },
    ];
    expect(dedupResponses(responseInput)).toEqual(expectedOutput);
  });
  it("should return an empty array when given an empty array", () => {
    expect(dedupResponses([])).toEqual([]);
  });
  it("should return the same name and address if phone does not exist on one response", () => {
    let updatedResponseInput = [
      responseInput[0],
      { ...responseInput[1], phone: "" },
      responseInput[2],
    ];
    expect(dedupResponses(updatedResponseInput)).toEqual([
      {
        address: "123 Main St",
        phone: "1234567890",
        name: "Business A",
      },
      {
        address: "123 Maine St",
        name: "Business A",
        phone: "",
      },
      {
        address: "11223 Oak St",
        phone: "3216549870",
        name: "Business B",
      },
    ]);
  });

  it("should treat undefined and empty string phone numbers as distinct", () => {
    const input = [
      { address: "Address 1", phone: undefined, name: "Business C" },
      { address: "Address 2", phone: "", name: "Business D" },
      { address: "Address 3", phone: "5555555555", name: "Business E" },
      { address: "Address 4", phone: undefined, name: "Business C" },
    ];
    const expectedOutput = [
      { address: "Address 1", phone: undefined, name: "Business C" },
      { address: "Address 2", phone: "", name: "Business D" },
      { address: "Address 3", phone: "5555555555", name: "Business E" },
      { address: "Address 4", phone: undefined, name: "Business C" },
    ];
    expect(dedupResponses(input)).toEqual(expectedOutput);
  });

  it("keeps empty string phones distinct from other empty strings", () => {
    const input = [
      { address: "123 Main", phone: "", name: "Business A" },
      { address: "256 Oak St", phone: "", name: "Business B" },
    ];
    const expectedOutput = [
      { address: "123 Main", phone: "", name: "Business A" },
      { address: "256 Oak St", phone: "", name: "Business B" },
    ];
    expect(dedupResponses(input)).toEqual(expectedOutput);
  });
});

describe("cleanedPhoneNum", () => {
  it("should return empty string for falsy input", () => {
    expect(cleanedPhoneNum("")).toBe("");
    expect(cleanedPhoneNum(null as unknown as string)).toBe("");
    expect(cleanedPhoneNum(undefined as unknown as string)).toBe("");
  });

  it("should remove non-digit characters", () => {
    expect(cleanedPhoneNum("(123) 456-7890")).toBe("1234567890");
    expect(cleanedPhoneNum("123.456.7890")).toBe("1234567890");
    expect(cleanedPhoneNum("+1 (123) 456-7890")).toBe("11234567890");
    expect(cleanedPhoneNum("123-456-7890 ext. 123")).toBe("1234567890123");
  });

  it("should return only digits for mixed input", () => {
    expect(cleanedPhoneNum("Call me at 123-456-7890!")).toBe("1234567890");
  });

  it("should return only digits for already clean input", () => {
    expect(cleanedPhoneNum("1234567890")).toBe("1234567890");
  });

  it("should handle international formats", () => {
    expect(cleanedPhoneNum("+44 20 7946 0958")).toBe("442079460958");
  });

  it("should handle numbers with spaces", () => {
    expect(cleanedPhoneNum("123 456 7890")).toBe("1234567890");
  });

  it("should handle numbers with mixed separators", () => {
    expect(cleanedPhoneNum("123-456.7890 ext 123")).toBe("1234567890123");
  });

  it("should handle numbers with parentheses", () => {
    expect(cleanedPhoneNum("(123) 456 7890")).toBe("1234567890");
  });
});
