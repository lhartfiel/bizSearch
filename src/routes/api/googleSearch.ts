import { createServerFileRoute } from "@tanstack/react-start/server";

const API_KEY = process.env.GOOGLE_API_KEY;

export const ServerRoute = createServerFileRoute("/api/googleSearch").methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("searchTerm");
    if (!searchTerm || searchTerm.trim() === "") {
      return { places: [] }; // Return empty results if no search term
    }

    const params = new URLSearchParams({
      query: searchTerm,
      key: API_KEY!,
    });

    // Use the legacy Places API -- don't fetch additional pages from Google
    // Google Places API charges per call for premium fields like website url, phone and ratings
    const searchResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`,
    );
    if (!searchResponse?.ok) {
      throw new Error(`Error: ${searchResponse?.status}`);
    }

    const searchData = await searchResponse.json();
    const results = searchData.results || [];
    const topResults = results.slice(0, 4); // Use only the first 4 results from Google to limit charges fetching premium fields like website

    const placesWithDetails = await Promise.all(
      topResults.map(async (item: any, index: number) => {
        if (index < 4) {
          try {
            const detailUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&fields=formatted_phone_number,website&key=${API_KEY}`;
            const detailResponse = await fetch(detailUrl);

            if (!detailResponse.ok) {
              throw new Error(`HTTP error! status: ${detailResponse.status}`);
            }

            const detailData = await detailResponse.json();

            return {
              ...item,
              phone: detailData.result?.formatted_phone_number || null,
              webUrl: detailData.result?.website || null,
            };
          } catch (err) {
            console.error(`Failed fetching details for ${item.place_id}`, err);
            return { ...item, phone: null, webUrl: null };
          }
        }
      }),
    );

    return new Response(
      JSON.stringify({
        places: placesWithDetails,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  },
});
