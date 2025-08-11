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
    // Example: "400: Bad Request"
    const [statusCode, statusText] = foursquareJson.error.split(":");
    return {
      error: {
        status: +statusCode || 500,
        statusText: statusText?.trim() || "Unknown API error",
      },
    };
  }

  const foursquareNewObj = foursquareJson.results.map(
    (item: foursquarePlaceType) => {
      const num = cleanedPhoneNum(item?.tel);

      if (!item.location.formatted_address && !item.name) {
        return;
      }

      return {
        name: item?.name,
        address: item?.location.formatted_address,
        phone: num,
        rating: item?.rating,
        webUrl: item?.website,
      };
    },
  );

  return {
    places: foursquareNewObj,
    fourNextPage: foursquareJson.nextPageToken || "",
  };
};
