import { cleanedPhoneNum } from "../helpers/helperFns";
import { searchResultType } from "../helpers/constants";
import { foursquarePlaceType } from "../helpers/constants";

export const fetchFoursquareResults = async (
  name: string,
  location: string,
  existingResults?: searchResultType,
) => {
  const foursquareUrl = existingResults?.fourNextPage.length
    ? `&fourNextPage=${existingResults.fourNextPage}`
    : "";
  const foursquareRes = await fetch(
    `/api/foursquareSearch?name=${encodeURIComponent(name)}&location=${location}${foursquareUrl}`,
  );
  const foursquareJson = await foursquareRes.json();
  console.log("jsonFOUR", foursquareJson);

  if (foursquareJson.error) return;

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
