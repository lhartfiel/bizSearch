import { http, HttpResponse } from "msw";

export const handlers = [
  http.post(
    "https://places.googleapis.com/v1/places:searchText",
    async ({ request }) => {
      const body = await request.json();
      const textQuery = body.textQuery;

      if (textQuery === "coffee in Seattle, WA") {
        return HttpResponse.json({
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
      }

      if (!textQuery || textQuery === "empty")
        return HttpResponse.json({ places: [] });
      if (textQuery === "oops")
        return HttpResponse.json(
          { error: "No results found" },
          { status: 404 },
        );

      return HttpResponse.json({}, { status: 404 });
    },
  ),

  http.get("https://places-api.foursquare.com/places/search", ({ request }) => {
    const url = new URL(request.url);

    const query = url.searchParams.get("query");
    const near = url.searchParams.get("near");
    const cursor = url.searchParams.get("cursor");

    if (query === "coffee" && near === "Seattle, WA") {
      return HttpResponse.json({
        name: "The Coffee Bean",
        location: { formatted_address: "123 Main Street, Seattle, WA 98101" },
        tel: "(123) 456-7890",
        website: "https://thecoffeebean.com",
        nextPageToken: cursor || null,
      });
    }

    if (query === "oops") {
      return HttpResponse.json(
        { error: "No results found for your search." },
        { status: 404 },
      );
    }

    return HttpResponse.json({}, { status: 404 });
  }),

  // Network error handler for foursquare
  http.get("https://places-api.foursquare.com/network-error", () => {
    return Response.error(); // simulate network failure
  }),

  // Network error handler for foursquare
  http.get(
    "https://places.googleapis.com/v1/places:searchText/network-error",
    () => {
      return Response.error(); // simulate network failure
    },
  ),
];
