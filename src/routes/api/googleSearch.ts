import { createServerFileRoute } from "@tanstack/react-start/server";

const API_KEY = process.env.GOOGLE_API_KEY;

export const ServerRoute = createServerFileRoute("/api/googleSearch").methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("searchTerm");
    if (!searchTerm || searchTerm.trim() === "") {
      return { places: [] }; // Return empty results if no search term
    }

    // Use the new Places API -- don't fetch additional pages from Google
    // Google Places API charges per call for premium fields like website url, phone and ratings
    const searchApi = `https://places.googleapis.com/v1/places:searchText`;
    const callFetch = async () => {
      return await fetch(searchApi, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": `${API_KEY}`,
          "X-Goog-FieldMask":
            "places.displayName,places.formattedAddress,places.nationalPhoneNumber,places.rating,places.userRatingCount,places.websiteUri",
        },
        body: JSON.stringify({ textQuery: searchTerm }),
      });
    };
    const searchResponse = await callFetch();
    if (!searchResponse?.ok) {
      throw new Error(`Error: ${searchResponse?.status}`);
    }

    const searchData = await searchResponse.json();
    const results = searchData.places || [];

    return new Response(
      JSON.stringify({
        places: results,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  },
});
