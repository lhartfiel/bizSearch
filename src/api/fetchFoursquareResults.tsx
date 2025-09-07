import { cleanedPhoneNum } from "../helpers/helperFns";
import { searchResultType } from "../helpers/constants";
import { foursquarePlaceType } from "../helpers/constants";

export const fetchFoursquareResults = async (
  name: string,
  location: string,
  existingResults?: searchResultType,
) => {
  const foursquareUrl = existingResults?.fourNextPage?.length
    ? `&fourNextPage=${existingResults.fourNextPage}`
    : "";
  try {
    const foursquareRes = await fetch(
      `/api/foursquareSearch?name=${encodeURIComponent(name)}&location=${location}${foursquareUrl}`,
    );

    if (!foursquareRes.ok) {
      console.error("Foursquare fetch failed:", foursquareRes.statusText);
      return {
        error: {
          status: foursquareRes.status,
          statusText: foursquareRes.statusText,
        },
      };
    }

    const foursquareJson = await foursquareRes.json();

    if (foursquareJson.error) {
      // Example: "400: Bad Request"; API response still returns a 200 status
      const [statusCode, statusText] = foursquareJson.error.split(":");
      return {
        error: {
          status: +statusCode || 500,
          statusText: statusText?.trim() || "Unknown API error",
        },
      };
    }
    const foursquareNewObj = foursquareJson.results
      ? foursquareJson.results
          .filter((item: foursquarePlaceType) => {
            return (
              !!item.name &&
              !!item.location.formatted_address &&
              (!!item.tel || !!item.website)
            );
          })
          .map((item: foursquarePlaceType) => {
            const num = cleanedPhoneNum(item.tel ?? "");
            return {
              name: item.name,
              address: item.location.formatted_address,
              phone: num,
              rating: item.rating,
              webUrl: item.website,
            };
          })
      : [];

    return {
      places: foursquareNewObj,
      fourNextPage: foursquareJson.nextPageToken || "",
    };
  } catch (err) {
    console.error("Foursquare fetch error:", err);
    return {
      error: { status: 500, statusText: "Network failure" },
    };
  }
};
