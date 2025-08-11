import { cleanedPhoneNum } from "../helpers/helperFns";
import { searchResultType, googlePlaceType } from "../helpers/constants";

export const fetchGoogleResults = async (
  name: string,
  location: string,
  initialNext: string,
  existingResults: searchResultType | undefined,
) => {
  const nextParam =
    initialNext === "initial" ? 0 : existingResults?.googleNextPage?.length;
  const googleUrl =
    nextParam && nextParam !== 0
      ? `&pagetoken=${existingResults?.googleNextPage}`
      : "";
  const googleTerm = name + location;
  const googleRes = await fetch(
    `/api/googleSearch?searchTerm=${encodeURIComponent(googleTerm)}${googleUrl}`,
  );
  const googleJson = await googleRes.json();
  if (!googleRes.ok) {
    console.error("Google fetch failed:", googleRes.statusText);
    return {
      error: { status: googleJson.status, statusText: googleJson.statusText },
    };
  }

  if (googleJson.error) {
    // Example: "400: Bad Request"
    const [statusCode, statusText] = googleJson.error.split(":");
    return {
      error: {
        status: +statusCode || 500,
        statusText: statusText?.trim() || "Unknown API error",
      },
    };
  }

  const googleNextPage = googleJson.nextPageToken;
  const googleNewObj = googleJson?.places.map((item: googlePlaceType) => {
    const num = cleanedPhoneNum(item?.phone);

    if (!item.formatted_address && !item?.name) {
      // Don't return any results if there isn't an address or name
      return;
    }
    return {
      address: item?.formatted_address,
      name: item?.name,
      phone: num,
      price: item?.priceRange,
      rating: item?.rating,
      ratingCount: item?.user_ratings_total,
      webUrl: item?.webUrl,
    };
  });
  return { places: googleNewObj, googleNextPage };
};
