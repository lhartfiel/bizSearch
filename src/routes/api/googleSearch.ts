import { createServerFileRoute } from "@tanstack/react-start/server";

const API_KEY = process.env.GOOGLE_API_KEY;

type BodyType = {
  textQuery: string;
  pageToken?: string | null;
};

export const ServerRoute = createServerFileRoute("/api/googleSearch").methods({
  GET: async ({ request }) => {
    const url = new URL(request.url);
    const searchTerm = url.searchParams.get("searchTerm");
    const pageToken = url.searchParams.get("pagetoken");

    if (!searchTerm || searchTerm.trim() === "") {
      return { places: [] }; // Return empty results if no search term
    }

    const body = pageToken
      ? { textQuery: searchTerm, pageToken: pageToken }
      : { textQuery: searchTerm };
    const fetchUrl = "https://places.googleapis.com/v1/places:searchText";
    const callFetch = async (body: BodyType) => {
      return await fetch(fetchUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": process.env.GOOGLE_API_KEY!,
          "X-Goog-FieldMask":
            "places.displayName,places.googleMapsLinks,places.generativeSummary,places.delivery,places.outdoorSeating,places.primaryType,places.priceRange,places.userRatingCount,places.formattedAddress,places.nationalPhoneNumber,nextPageToken,places.priceLevel,places.id,places.priceRange,places.rating,places.websiteUri",
        },
        body: JSON.stringify(body),
      });
    };

    const response = await callFetch(body);
    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Google API error details:", errorBody);
      throw new Error(`Google API returned ${response.status}: ${errorBody}`);
    }

    let data = await response.json();
    const nextPageToken = data.nextPageToken || null;
    if (!nextPageToken) {
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // If there is a nextPageToken, fetch the next page of results
      const body = { textQuery: searchTerm, pageToken: nextPageToken };
      const newResponse = await callFetch(body);
      const newData = await newResponse.json();

      const comboData = {
        places: [...data.places, ...newData.places],
        nextPageToken: newData.nextPageToken || null,
      };
      console.log("COM", comboData);
      return new Response(JSON.stringify(comboData), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
});
