import { describe, it, expect, vi } from "vitest";

describe("googleSearch API", () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
  });

  it("has a 200 response with the correct data", async () => {
    let searchName = "coffee in Seattle, WA";
    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: "POST",
        body: JSON.stringify({
          textQuery: searchName,
          pageSize: 10,
          rankPreference: "RELEVANCE",
        }),
      },
    );
    expect(response.status).toBe(200);

    const json = await response.json();

    expect(json).toEqual({
      places: [
        {
          displayName: "Google Coffee",
          formattedAddress: "123 Google Main, Seattle, WA 98101",
          nationalPhoneNumber: "(321) 456-7890",
          websiteUri: "https://googlecoffee.com",
          rating: 4.5,
          userRatingCount: 200,
        },
      ],
    });
  });

  it("throws a 404 error", async () => {
    let searchName = "oops";
    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: "POST",
        body: JSON.stringify({
          textQuery: searchName,
          pageSize: 10,
          rankPreference: "RELEVANCE",
        }),
      },
    );
    expect(response.status).toBe(404);

    expect(await response.json()).toEqual({
      error: "No results found",
    });
  });

  it("throws a network error", async () => {
    let searchName = "oops";
    await expect(
      fetch("https://places.googleapis.com/v1/places:searchText/network-error"),
    ).rejects.toThrow();
  });

  it("returns empty array when no search term is provided", async () => {
    let searchName = "empty";
    const response = await fetch(
      `https://places.googleapis.com/v1/places:searchText`,
      {
        method: "POST",
        body: JSON.stringify({
          textQuery: searchName,
          pageSize: 10,
          rankPreference: "RELEVANCE",
        }),
      },
    );
    expect(response.status).toBe(200);

    const json = await response.json();

    expect(json).toEqual({ places: [] });
  });
});
