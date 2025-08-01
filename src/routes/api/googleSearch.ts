import { createServerFileRoute } from "@tanstack/react-start/server";

const API_KEY = process.env.GOOGLE_API_KEY;

export const ServerRoute = createServerFileRoute("/api/googleSearch").methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("searchTerm");
    const pageToken = url.searchParams.get("pagetoken");
    if (!searchTerm || searchTerm.trim() === "") {
      return { places: [] }; // Return empty results if no search term
    }

    const params = new URLSearchParams({
      query: searchTerm,
      key: API_KEY!,
    });
    if (pageToken) params.append("pagetoken", pageToken);

    const searchResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`,
    );
    if (!searchResponse?.ok) {
      throw new Error(`HTTP error! status: ${searchResponse?.status}`);
    }

    const searchData = await searchResponse.json();
    const results = searchData.results || [];

    const placesWithDetails = await Promise.all(
      results.map(async (item: any) => {
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
      }),
    );

    return new Response(
      JSON.stringify({
        places: placesWithDetails,
        nextPageToken: searchData.next_page_token || null,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  },
});
