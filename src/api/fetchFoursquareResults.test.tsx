import { describe, it, expect } from "vitest";
import { fetchFoursquareResults } from "./fetchFoursquareResults";

describe("fetchFoursquareResults", () => {
  it("returns correct data for a search with name and location", async () => {
    const result = await fetchFoursquareResults("coffee", "Seattle, WA");
    expect(result.places[0].name).toBe("The Coffee Bean");
  });

  it("handles network failures gracefully", async () => {
    const result = await fetchFoursquareResults("network-error", "Seattle, WA");
    expect(result.error).toBeDefined();
    expect(result.error?.status).toBe(500);
    expect(result.error?.statusText).toBe("Network failure");
  });

  it("handles incomplete results", async () => {
    const result = await fetchFoursquareResults(
      "incomplete-results",
      "Seattle, WA",
    );
    expect(result.places.length).toBe(1);
    expect(result.places[0].name).toBe("Valid Place");
  });

  it("handles malformed JSON gracefully", async () => {
    const result = await fetchFoursquareResults(
      "malformed-json",
      "Seattle, WA",
    );
    expect(result.places).toEqual([]);
  });
});
