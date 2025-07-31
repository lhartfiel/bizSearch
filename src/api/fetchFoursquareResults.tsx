import { cleanedPhoneNum } from "../helpers/helperFns";
import { searchResultType } from "../helpers/constants";
import { foursquarePlaceType } from "../helpers/constants";

export const fetchFoursquareResults = async (
  name: string,
  location: string,
  searchResults?: searchResultType,
) => {
  const foursquareUrl = searchResults?.fourNextPage.length
    ? `&fourNextPage=${searchResults.fourNextPage}`
    : "";
  const foursquareRes = await fetch(
    `/api/foursquareSearch?name=${encodeURIComponent(name)}&location=${location}${foursquareUrl}`,
  );
  const foursquareJson = await foursquareRes.json();

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
