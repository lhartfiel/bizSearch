import { describe, it, expect, vi } from "vitest";
import { fetchGoogleSearchHandler } from "./googleSearch";

describe("fetchGoogleSearchHandler handler", () => {
  let originalFetch: any;

  beforeEach(() => {
    originalFetch = global.fetch;
  });

  afterEach(() => {
    global.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("returns 200 response with search results", async () => {
    const req = new Request(
      "http://localhost/api/googleSearch?searchTerm=coffeeSeattle,WA",
      { method: "GET" },
    );

    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(
          JSON.stringify({ places: [{ name: "The Coffee Bean" }] }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      ),
    ) as any;

    const res = await fetchGoogleSearchHandler({ request: req });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      places: [{ name: "The Coffee Bean" }],
    });
  });

  it("returns 200 response with empty array for empty search term", async () => {
    const req = new Request("http://localhost/api/googleSearch?searchTerm=", {
      method: "GET",
    });

    const res = await fetchGoogleSearchHandler({ request: req });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({ places: [] });
  });

  it("returns 404 for unknown search", async () => {
    const req = new Request(
      "http://localhost/api/foursquareSearch?searchTerm=oops",
    );

    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: "No results found" }), {
          status: 404,
          statusText: "Not Found",
        }),
      ),
    ) as any;

    const res = await fetchGoogleSearchHandler({ request: req });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({ error: "404: Not Found" });
  });
});
