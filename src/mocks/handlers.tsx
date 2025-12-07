import { http, HttpResponse } from "msw";

export const handlers = [
  http.get(`/api/foursquareSearch`, ({ request }) => {
    const url = new URL(request.url);

    const name = url.searchParams.get("name");
    const location = url.searchParams.get("location");
    const fourNextPage = url.searchParams.get("fourNextPage");

    if (name === "coffee" && location === "Seattle, WA") {
      return HttpResponse.json({
        results: [
          {
            name: "The Coffee Bean",
            location: {
              formatted_address: "123 Main Street, Seattle, WA 98101",
            },
            tel: "(123) 456-7890",
            website: "https://thecoffeebean.com",
            nextPageToken: fourNextPage || null,
          },
        ],
      });
    }

    if (name === "coffee & tea" && location === "Seattle, WA / Downtown") {
      return HttpResponse.json({
        name: "Tea & Coffee Place",
        location: { formatted_address: "456 Special Street, Seattle, WA" },
        tel: "(111) 222-3333",
        website: "https://teaandcoffee.com",
        nextPageToken: fourNextPage || null,
      });
    }

    if (name === "network-error") {
      return Response.error(); // will be caught by the try/catch in the route
    }

    if (name === "malformed-json") {
      return HttpResponse.json({ foo: "bar" }); // missing 'results'
    }

    if (name === "incomplete-results") {
      return HttpResponse.json({
        results: [
          {
            name: "Valid Place",
            location: { formatted_address: "123 St" },
            tel: "123",
            website: null,
          },
          {
            name: "",
            location: { formatted_address: "123 St" },
            tel: "123",
            website: null,
          },
        ],
      });
    }
  }),

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
