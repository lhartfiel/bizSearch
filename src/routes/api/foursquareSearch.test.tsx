import { describe, it, expect, vi } from "vitest";

describe("fetchFoursquareResults", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("has a 200 response with the correct data", async () => {
    let searchName = "coffee";
    let searchLocation = "Seattle, WA";
    let searchNextPage = "abc123";
    const LIMIT = 25;
    const response = await fetch(
      `https://places-api.foursquare.com/places/search?query=${searchName}&near=${searchLocation}&sort=RELEVANCE&limit=${LIMIT}&cursor=${searchNextPage}`,
    );
    expect(response.status).toBe(200);

    const json = await response.json();

    expect(json).toEqual({
      name: "The Coffee Bean",
      location: {
        formatted_address: "123 Main Street, Seattle, WA 98101",
      },
      tel: "(123) 456-7890",
      nextPageToken: "abc123",
      website: "https://thecoffeebean.com",
    });
  });

  it("throws a 404 error", async () => {
    let searchName = "oops";
    let searchLocation = "Seattle, WA";
    let searchNextPage = "abc123";
    const LIMIT = 25;
    const response = await fetch(
      `https://places-api.foursquare.com/places/search?query=${searchName}&near=${searchLocation}&sort=RELEVANCE&limit=${LIMIT}&cursor=${searchNextPage}`,
    );
    expect(response.status).toBe(404);

    expect(await response.json()).toEqual({
      error: "No results found for your search.",
    });
  });

  it("throws a network error", async () => {
    await expect(
      fetch("https://places-api.foursquare.com/network-error"),
    ).rejects.toThrow();
  });
});
