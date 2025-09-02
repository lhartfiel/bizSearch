import { describe, it, expect, vi } from "vitest";
import { fetchFoursquareSearchHandler } from "./foursquareSearch";

describe("foursquareSearch handler", () => {
  it("returns 200 with nextPageToken", async () => {
    const req = new Request(
      "http://localhost/api/foursquareSearch?name=coffee&location=Seattle,WA&fourNextPage=abc123",
    );

    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ name: "The Coffee Bean" }), {
          headers: { link: "link; rel=next; cursor=abc123" },
        }),
      ),
    ) as any;

    const res = await fetchFoursquareSearchHandler({ request: req });
    const json = await res.json();

    expect(res.status).toBe(200);
    expect(json).toEqual({
      name: "The Coffee Bean",
      nextPageToken: "abc123",
    });
  });

  it("returns 404 for unknown search", async () => {
    const req = new Request(
      "http://localhost/api/foursquareSearch?name=oops&location=Seattle,WA",
    );

    global.fetch = vi.fn(() =>
      Promise.resolve(
        new Response(JSON.stringify({ error: "No results found" }), {
          status: 404,
        }),
      ),
    ) as any;

    const res = await fetchFoursquareSearchHandler({ request: req });
    const json = await res.json();

    expect(res.status).toBe(404);
    expect(json).toEqual({ error: "404: " });
  });
});
