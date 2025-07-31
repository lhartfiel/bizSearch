import { cleanedPhoneNum } from "../helpers/helperFns";
import { searchResultType, googlePlaceType } from "../helpers/constants";

export const fetchGoogleResults = async (
  name: string,
  location: string,
  initialNext: string,
  existingResults: searchResultType | undefined,
) => {
  const nextParam =
    initialNext === "initial" ? 0 : existingResults?.googleNextPage.length;
  const googleUrl =
    nextParam && nextParam !== 0
      ? `&pagetoken=${existingResults?.googleNextPage}`
      : "";
  const googleTerm = name + location;
  const googleRes = await fetch(
    `/api/googleSearch?searchTerm=${encodeURIComponent(googleTerm)}${googleUrl}`,
  );

  if (!googleRes.ok) {
    const text = await googleRes.text();
    console.error("Fetch failed:", text);
    throw new Error("Failed to fetch");
  }

  const googleJson = await googleRes.json();
  const nextPage = googleJson.nextPageToken;
  const googleNewObj = googleJson?.places.map((item: googlePlaceType) => {
    const num = cleanedPhoneNum(item?.nationalPhoneNumber);

    if (!item.formattedAddress && !item?.displayName.text) {
      // Don't return any results if there isn't an address or name
      return;
    }

    return {
      address: item?.formattedAddress,
      directions: item?.googleMapsLinks?.directionsUri,
      name: item?.displayName.text,
      phone: num,
      price: item?.priceRange,
      rating: item?.rating,
      ratingCount: item?.userRatingCount,
      summary: item?.generativeSummary?.overview?.text,
      webUrl: item?.websiteUri,
    };
  });
  return { places: googleNewObj, nextPage };
};
