import { createServerFileRoute } from "@tanstack/react-start/server";

const FOURSQUARE_API_KEY = process.env.FOURSQUARE_API_KEY;
const LIMIT = 25;

export const fetchFoursquareSearchHandler = async ({
  request,
}: {
  request: Request;
}) => {
  const url = new URL(request.url);
  const searchName = url.searchParams.get("name");
  const searchLocation = url.searchParams.get("location");
  const searchNextPage = url.searchParams.get("fourNextPage");
  const apiUrl = `https://places-api.foursquare.com/places/search?query=${searchName}&near=${searchLocation}&sort=RELEVANCE&limit=25&cursor=${searchNextPage}`;
  const response = await fetch(apiUrl, {
    method: "GET",
    headers: {
      accept: "application/json",
      "X-Places-Api-Version": "2025-06-17",
      authorization: `Bearer ${FOURSQUARE_API_KEY}`,
    },
  });
  if (!response.ok) {
    return new Response(
      JSON.stringify({ error: `${response.status}: ${response.statusText}` }),
      {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
  const link = response.headers.get("link");
  const nextPageToken = link?.match(/cursor=([^&]+)/)?.[1];
  const json = await response.json();
  return new Response(
    JSON.stringify({ ...json, nextPageToken: nextPageToken || null }),
    {
      headers: { "Content-Type": "application/json" },
    },
  );
};

export const ServerRoute = createServerFileRoute(
  "/api/foursquareSearch",
).methods({
  GET: fetchFoursquareSearchHandler,
});
