import { cleanedPhoneNum } from "../helpers/helperFns";
import { googlePlaceType } from "../helpers/constants";

export const fetchGoogleResults = async (name: string, location: string) => {
  const googleTerm = name + location;
  const googleRes = await fetch(
    `/api/googleSearch?searchTerm=${encodeURIComponent(googleTerm)}`,
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

  const googleNewObj = googleJson?.places
    .filter((item: googlePlaceType) => {
      return (
        !!item.displayName?.text &&
        !!item.formattedAddress &&
        (!!item.nationalPhoneNumber || !!item.websiteUri)
      );
    })
    .map((item: googlePlaceType) => {
      const phoneRaw = item.nationalPhoneNumber || "";
      const num = cleanedPhoneNum(phoneRaw);
      return {
        address: item.formattedAddress,
        name: item.displayName.text,
        phone: num ?? "",
        rating: item.rating,
        ratingCount: item.userRatingCount,
        webUrl: item.websiteUri,
      };
    });
  return { places: googleNewObj };
};
